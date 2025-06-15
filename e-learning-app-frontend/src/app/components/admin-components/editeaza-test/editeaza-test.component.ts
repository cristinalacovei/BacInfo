import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TestService } from '../../../services/test.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionService } from '../../../services/question.service';
import { AnswerService } from '../../../services/answer.service';

@Component({
  selector: 'app-editeaza-test',
  standalone: false,
  templateUrl: './editeaza-test.component.html',
  styleUrls: ['./editeaza-test.component.scss'],
})
export class EditeazaTestComponent implements OnInit {
  testForm!: FormGroup;
  testId = '';
  lessonId = '';
  currentQuestionIndex = 0;
  private autoSaveIntervalId: any;
  private readonly BACKUP_KEY = 'test-backup-';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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
        questions: this.fb.array(
          test.questions.map((q) => this.createQuestionGroup(q))
        ),
      });

      // 1. Încărcăm backup-ul dacă există
      const backup = localStorage.getItem(this.BACKUP_KEY + this.testId);
      if (backup) {
        try {
          this.testForm.patchValue(JSON.parse(backup));
          this.showSnackbar('🕒 Backup încărcat automat.', 'snackbar-success');
        } catch (e) {
          console.warn('Backup invalid:', e);
        }
      }

      // 2. Pornim auto-salvarea la fiecare minut
      this.autoSaveIntervalId = setInterval(() => {
        if (this.testForm.valid) {
          const backupData = JSON.stringify(this.testForm.value);
          localStorage.setItem(this.BACKUP_KEY + this.testId, backupData);
          console.log('Auto-backup salvat.');
        }
      }, 60000);
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

  selectSingle(qIndex: number, aIndex: number): void {
    this.getAnswers(qIndex).controls.forEach((control, i) => {
      control.get('isCorrect')?.setValue(i === aIndex);
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

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) this.currentQuestionIndex--;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.getQuestions().length - 1)
      this.currentQuestionIndex++;
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

    const updatedTest = { id: this.testId, ...this.testForm.value };
    this.testService.updateTest(updatedTest).subscribe({
      next: () => {
        localStorage.removeItem(this.BACKUP_KEY + this.testId);
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
    this.getQuestions().controls.forEach((q) => {
      q.get('questionText')?.markAsTouched();
      (q.get('answers') as FormArray).controls.forEach((a) =>
        a.get('answerText')?.markAsTouched()
      );
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

  confirmaStergereIntrebare(index: number): void {
    this.confirmaDialog('Ești sigur că vrei să ștergi această întrebare?')
      .afterClosed()
      .subscribe((confirmed) => confirmed && this.stergeIntrebare(index));
  }

  confirmaStergereRaspuns(qIndex: number, aIndex: number): void {
    this.confirmaDialog('Ești sigur că vrei să ștergi acest răspuns?')
      .afterClosed()
      .subscribe(
        (confirmed) => confirmed && this.stergeRaspuns(qIndex, aIndex)
      );
  }

  stergeIntrebare(index: number): void {
    const question = this.getQuestions().at(index);
    const questionId = question.get('id')?.value;

    if (questionId) {
      this.questionService.deleteQuestion(questionId).subscribe(() => {
        this.removeQuestion(index);
        this.showSnackbar('✅ Întrebarea a fost ștearsă.', 'snackbar-success');
      });
    } else {
      this.removeQuestion(index);
    }
  }

  stergeRaspuns(qIndex: number, aIndex: number): void {
    const answer = this.getAnswers(qIndex).at(aIndex);
    const answerId = answer.get('id')?.value;

    if (answerId) {
      this.answerService.deleteAnswer(answerId).subscribe(() => {
        this.getAnswers(qIndex).removeAt(aIndex);
        this.showSnackbar('✅ Răspunsul a fost șters.', 'snackbar-success');
      });
    } else {
      this.getAnswers(qIndex).removeAt(aIndex);
    }
  }

  private removeQuestion(index: number): void {
    this.getQuestions().removeAt(index);
    this.currentQuestionIndex = Math.min(
      this.currentQuestionIndex,
      this.getQuestions().length - 1
    );
  }

  private confirmaDialog(message: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmare ștergere',
        message,
        singleButton: false,
      },
    });
  }

  ngOnDestroy(): void {
    if (this.autoSaveIntervalId) {
      clearInterval(this.autoSaveIntervalId);
    }
  }
}
