import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../../services/test.service';
import { AnswerService } from '../../services/answer.service';

interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
  isSelected?: boolean; // ✅ Adăugat pentru MULTIPLE_CHOICE
}

interface Question {
  id: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  answers: Answer[];
  selectedAnswer?: string; // ✅ Pentru SINGLE_CHOICE
}

interface TestEntity {
  id: string;
  classLevel: number;
  questions: Question[];
}

// ✅ Actualizat conform backend-ului
interface ValidationResult {
  correctAnswers: number;
  totalQuestions: number;
  correctAnswerIds: string[]; // ✅ Liste cu ID-urile răspunsurilor corecte
  incorrectAnswerIds: string[]; // ✅ Liste cu ID-urile răspunsurilor greșite
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
  showResults: boolean = false; // ✅ Variabilă pentru a afișa răspunsurile corecte
  correctAnswersSet: Set<string> = new Set(); // ✅ Adăugat pentru stocare ID-uri corecte
  incorrectAnswersSet: Set<string> = new Set(); // ✅ Adăugat pentru stocare ID-uri greșite

  constructor(
    private route: ActivatedRoute,
    @Inject(TestService) private testService: TestService,
    @Inject(AnswerService) private answerService: AnswerService
  ) {}

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('id');
    if (this.testId) {
      this.loadTest();
    }
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
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitTest(): void {
    if (!this.test) return;

    const selectedAnswerIds: string[] = [];
    this.test.questions.forEach((question) => {
      if (
        question.questionType === 'SINGLE_CHOICE' &&
        question.selectedAnswer
      ) {
        selectedAnswerIds.push(question.selectedAnswer);
      } else if (question.questionType === 'MULTIPLE_CHOICE') {
        question.answers
          .filter((answer) => answer.isSelected)
          .forEach((answer) => selectedAnswerIds.push(answer.id));
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

        // 🟢 Stocăm ID-urile răspunsurilor corecte și greșite
        this.correctAnswersSet = new Set(result.correctAnswerIds);
        this.incorrectAnswersSet = new Set(result.incorrectAnswerIds);

        console.log(
          `📊 Scor primit de la backend: ${this.score}/${this.totalQuestions}`
        );
        console.log('✅ Răspunsuri corecte:', this.correctAnswersSet);
        console.log('❌ Răspunsuri greșite:', this.incorrectAnswersSet);

        this.showResults = true;
      });
  }

  toggleResults(): void {
    this.showResults = !this.showResults;
    console.log(`🔍 Vizualizare rezultate: ${this.showResults}`);
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
}
