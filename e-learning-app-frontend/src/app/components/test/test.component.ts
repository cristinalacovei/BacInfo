import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../../services/test.service';
import { AnswerService } from '../../services/answer.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProgressService } from '../../services/progress.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { QuestionService } from '../../services/question.service';
import { Answer } from '../../types/answer.types';
import { Question } from '../../types/question.types';
import { TestEntity } from '../../types/test.types';
import { Lesson } from '../../types/lesson.types';

interface ValidationResult {
  correctAnswers: number;
  totalQuestions: number;
  correctAnswerIds: string[];
  incorrectAnswerIds: string[];
}

@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
  testId: string | null = null;
  test: TestEntity | null = null;
  currentQuestionIndex = 0;
  score: number | null = null;
  totalQuestions: number | undefined;
  showResults: boolean = false;
  correctAnswersSet: Set<string> = new Set();
  incorrectAnswersSet: Set<string> = new Set();
  progressValue: number = 0;

  currentQuestion: string = '';
  helpMessage: string = '';
  loadingHelp = false;
  helpRequests = 0;
  maxHelpRequests = 3;
  isHelpPopupVisible = false;
  isGeneralTest = false;
  testStarted = false;
  timeLeft: number = 15 * 60;
  intervalId: any;

  constructor(
    private route: ActivatedRoute,
    @Inject(TestService) private testService: TestService,
    @Inject(AnswerService) private answerService: AnswerService,
    private progressService: ProgressService,
    private authService: AuthService,
    private QuestionsService: QuestionService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  ngOnInit(): void {
    const currentRoute = this.route.snapshot.routeConfig?.path;
    this.isGeneralTest = currentRoute === 'test-general';

    if (this.isGeneralTest) {
      this.QuestionsService.getRandomQuestions().subscribe((questions) => {
        this.test = {
          id: this.generateUUID(),
          classLevel: 0,
          questions: questions,
        };
      });
    } else {
      this.testId = this.route.snapshot.paramMap.get('id');
      if (this.testId) {
        {
          this.loadTest();
          this.testStarted = true;
        }
      }
    }
  }

  startTest(): void {
    this.testStarted = true;
    this.startTimer();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.intervalId);
        this.submitTest();
      }
    }, 1000);
  }

  getMinutes(): string {
    return Math.floor(this.timeLeft / 60)
      .toString()
      .padStart(2, '0');
  }

  getSeconds(): string {
    return (this.timeLeft % 60).toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  loadTest(): void {
    this.testService.getTestById(this.testId!).subscribe((test) => {
      this.test = test;
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < (this.test?.questions.length || 0) - 1) {
      this.currentQuestionIndex++;
    }
    this.updateProgress();
  }

  updateProgress(): void {
    if (!this.test) return;

    const total = this.test.questions.length;
    const completate = this.test.questions.filter((question) => {
      if (question.questionType === 'SINGLE_CHOICE') {
        return !!question.selectedAnswer;
      } else if (question.questionType === 'MULTIPLE_CHOICE') {
        return question.answers.some((a: Answer) => a.isSelected);
      }
      return false;
    }).length;

    this.progressValue = (completate / total) * 100;
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitTest(): void {
    if (!this.test) return;

    const incompleteQuestions = this.test.questions.some((question) => {
      if (question.questionType === 'SINGLE_CHOICE') {
        return !question.selectedAnswer;
      } else if (question.questionType === 'MULTIPLE_CHOICE') {
        return !question.answers.some((a: Answer) => a.isSelected);
      }
      return true;
    });

    if (incompleteQuestions) {
      this.showIncompleteDialog();
      return;
    }

    const selectedAnswerIds: string[] = [];
    this.test.questions.forEach((question) => {
      if (
        question.questionType === 'SINGLE_CHOICE' &&
        question.selectedAnswer
      ) {
        selectedAnswerIds.push(question.selectedAnswer);
      } else if (question.questionType === 'MULTIPLE_CHOICE') {
        question.answers
          .filter((answer: Answer) => answer.isSelected)
          .forEach((answer: Answer) => selectedAnswerIds.push(answer.id));
      }
    });

    console.log(
      '🔍 DEBUG: Răspunsuri selectate trimise la backend:',
      selectedAnswerIds
    );

    this.answerService
      .validateAnswers(selectedAnswerIds)
      .subscribe((result: ValidationResult) => {
        this.score = result.correctAnswers;
        this.totalQuestions = result.totalQuestions;

        const scorePercentage = Math.round(
          (result.correctAnswers / result.totalQuestions) * 100
        );

        this.correctAnswersSet = new Set(result.correctAnswerIds);
        this.incorrectAnswersSet = new Set(result.incorrectAnswerIds);

        console.log(
          `📊 Scor primit de la backend: ${this.score}/${this.totalQuestions}`
        );

        this.showResults = true;

        this.authService.getCurrentUser().subscribe((user) => {
          if (!user || !user.id) {
            console.error('❌ Nu am putut obține userId-ul.');
            return;
          }

          const lessonId = this.test?.lesson?.id;

          if (!lessonId) {
            console.warn('⚠️ Lesson ID este null sau undefined în test!');
          }

          if (this.isGeneralTest) {
            console.log('ℹ️ Test general – progresul nu se salvează.');
            return;
          }

          this.progressService
            .saveProgress({
              userId: user.id,
              testId: this.test!.id,
              lessonId: lessonId,
              score: scorePercentage,
              completedAt: new Date().toISOString(),
            })
            .subscribe(() => {
              console.log(
                '✅ Progres salvat cu score (procent):',
                scorePercentage
              );
            });
        });
      });
  }

  toggleResults(): void {
    this.showResults = !this.showResults;
    console.log(`🔍 Vizualizare rezultate: ${this.showResults}`);
  }

  showIncompleteDialog(): void {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Test incomplet',
        message:
          '⚠️ Trebuie să răspunzi la toate întrebările înainte de a trimite testul!',
        singleButton: true,
      },
    });
  }

  isAnswerSelected(answer: Answer): boolean {
    if (!this.test) return false;

    const currentQuestion = this.test.questions[this.currentQuestionIndex];

    if (currentQuestion.questionType === 'SINGLE_CHOICE') {
      return currentQuestion.selectedAnswer === answer.id;
    } else if (currentQuestion.questionType === 'MULTIPLE_CHOICE') {
      return answer.isSelected === true;
    }
    return false;
  }

  isCorrectAnswer(answer: Answer): boolean {
    return this.showResults && this.correctAnswersSet.has(answer.id);
  }

  isIncorrectlySelected(answer: Answer): boolean {
    return this.showResults && this.incorrectAnswersSet.has(answer.id);
  }

  testComplet(): boolean {
    if (!this.test) return false;
    return this.test.questions.every((question) => {
      if (question.questionType === 'SINGLE_CHOICE') {
        return !!question.selectedAnswer;
      } else if (question.questionType === 'MULTIPLE_CHOICE') {
        return question.answers.some((a: Answer) => a.isSelected);
      }
      return false;
    });
  }
}
