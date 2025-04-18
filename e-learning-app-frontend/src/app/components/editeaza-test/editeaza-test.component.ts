import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TestService } from '../../services/test.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionService } from '../../services/question.service';
import { AnswerService } from '../../services/answer.service';

@Component({
  selector: 'app-editeaza-test',
  standalone: false,
  templateUrl: './editeaza-test.component.html',
  styleUrls: ['./editeaza-test.component.scss'],
})
export class EditeazaTestComponent implements OnInit {
  testForm!: FormGroup;
  testId!: string;
  lessonId!: string;
  currentQuestionIndex = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('testId') || '';
    this.testService.getTestById(this.testId).subscribe((test) => {
      this.lessonId = test.lesson?.id || '';
      this.testForm = this.fb.group({
        classLevel: [test.classLevel],
        questions: this.fb.array([]),
      });

      test.questions.forEach((q) => {
        this.getQuestions().push(this.createQuestionGroup(q));
      });
    });
  }

  createQuestionGroup(q?: any): FormGroup {
    return this.fb.group({
      id: [q?.id || null],
      questionText: [q?.questionText || '', Validators.required],
      questionType: [q?.questionType || 'SINGLE_CHOICE'],
      answers: this.fb.array(
        q?.answers?.map((a: any) =>
          this.fb.group({
            id: [a.id],
            answerText: [a.answerText, Validators.required],
            isCorrect: [a.isCorrect],
          })
        ) || [this.createAnswerGroup(), this.createAnswerGroup()]
      ),
    });
  }

  createAnswerGroup(): FormGroup {
    return this.fb.group({
      answerText: ['', Validators.required],
      isCorrect: [false],
    });
  }

  getQuestions(): FormArray {
    return this.testForm.get('questions') as FormArray;
  }

  getAnswers(index: number): FormArray {
    return this.getQuestions().at(index).get('answers') as FormArray;
  }

  adaugaIntrebare(): void {
    this.getQuestions().push(this.createQuestionGroup());
    this.currentQuestionIndex = this.getQuestions().length - 1;
  }

  adaugaRaspuns(index: number): void {
    this.getAnswers(index).push(this.createAnswerGroup());
  }

  selectSingle(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    answers.controls.forEach((control, i) => {
      control.get('isCorrect')?.setValue(i === answerIndex);
    });
  }

  isSingleChoice(index: number): boolean {
    return (
      this.getQuestions().at(index).get('questionType')?.value ===
      'SINGLE_CHOICE'
    );
  }

  isMultipleChoice(index: number): boolean {
    return (
      this.getQuestions().at(index).get('questionType')?.value ===
      'MULTIPLE_CHOICE'
    );
  }

  salveazaModificari(): void {
    if (this.testForm.invalid) {
      this.markFormTouched();
      this.showSnackbar(
        'Completează toate întrebările și răspunsurile!',
        'snackbar-error'
      );
      return;
    }

    const questions = this.getQuestions().value;
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].answers.some((a: any) => a.isCorrect)) {
        this.showSnackbar(
          `⚠️ Adaugă un răspuns corect pentru întrebarea ${i + 1}`,
          'snackbar-error'
        );
        return;
      }
    }

    this.testService
      .updateTest({ id: this.testId, ...this.testForm.value })
      .subscribe({
        next: () => {
          this.showSnackbar(
            '✅ Testul a fost actualizat cu succes!',
            'snackbar-success'
          );
        },
        error: () =>
          this.showSnackbar(
            '❌ Eroare la actualizarea testului.',
            'snackbar-error'
          ),
      });
  }

  markFormTouched(): void {
    this.testForm.markAllAsTouched();
    this.getQuestions().controls.forEach((questionGroup) => {
      questionGroup.get('questionText')?.markAsTouched();
      const answers = questionGroup.get('answers') as FormArray;
      answers.controls.forEach((a) => a.get('answerText')?.markAsTouched());
    });
  }

  showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, '', {
      duration: 4000,
      panelClass,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) this.currentQuestionIndex--;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.getQuestions().length - 1)
      this.currentQuestionIndex++;
  }

  stergeIntrebare(index: number): void {
    const questionGroup = this.getQuestions().at(index);
    const questionId = questionGroup.get('id')?.value;

    if (questionId) {
      this.questionService.deleteQuestion(questionId).subscribe(() => {
        this.getQuestions().removeAt(index);
        this.currentQuestionIndex = Math.min(
          this.currentQuestionIndex,
          this.getQuestions().length - 1
        );
        this.showSnackbar('✅ Întrebarea a fost ștearsă.', 'snackbar-success');
      });
    } else {
      this.getQuestions().removeAt(index); // doar local dacă nu are ID
    }
  }

  finalizeStergereIntrebare(index: number): void {
    const updatedTest = { id: this.testId, ...this.testForm.value };
    updatedTest.questions.splice(index, 1);

    this.testService.updateTest(updatedTest).subscribe(() => {
      this.getQuestions().removeAt(index);
      this.currentQuestionIndex = Math.min(
        this.currentQuestionIndex,
        this.getQuestions().length - 1
      );
      this.showSnackbar('✅ Întrebarea a fost ștearsă.', 'snackbar-success');
    });
  }

  stergeRaspuns(qIndex: number, aIndex: number): void {
    const answerGroup = this.getAnswers(qIndex).at(aIndex);
    const answerId = answerGroup.get('id')?.value;

    if (answerId) {
      this.answerService.deleteAnswer(answerId).subscribe(() => {
        this.getAnswers(qIndex).removeAt(aIndex);
        this.showSnackbar('✅ Răspunsul a fost șters.', 'snackbar-success');
      });
    } else {
      this.getAnswers(qIndex).removeAt(aIndex); // doar local dacă nu are ID
    }
  }

  finalizeStergereRaspuns(qIndex: number, aIndex: number): void {
    const updatedTest = { id: this.testId, ...this.testForm.value };
    updatedTest.questions[qIndex].answers.splice(aIndex, 1);

    this.testService.updateTest(updatedTest).subscribe(() => {
      this.getAnswers(qIndex).removeAt(aIndex);
      this.showSnackbar('✅ Răspunsul a fost șters.', 'snackbar-success');
    });
  }

  confirmaStergereIntrebare(index: number): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Confirmare ștergere',
          message: 'Ești sigur că vrei să ștergi această întrebare?',
          singleButton: false,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === true) this.stergeIntrebare(index);
      });
  }

  confirmaStergereRaspuns(qIndex: number, aIndex: number): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Confirmare ștergere',
          message: 'Ești sigur că vrei să ștergi acest răspuns?',
          singleButton: false,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === true) this.stergeRaspuns(qIndex, aIndex);
      });
  }
}
