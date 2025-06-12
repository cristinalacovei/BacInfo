import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TestService } from '../../services/test.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-adauga-test',
  standalone: false,
  templateUrl: './adauga-test.component.html',
  styleUrl: './adauga-test.component.scss',
})
export class AdaugaTestComponent implements OnInit {
  testForm!: FormGroup;
  lessonId!: string;
  backupKey = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('lessonId') || '';
    this.backupKey = `testDraft-${this.lessonId}`; // cheia unică per lecție

    this.testForm = this.fb.group({
      classLevel: [9],
      questions: this.fb.array([], Validators.minLength(1)),
    });

    // Încarcă backup dacă există
    const savedTest = localStorage.getItem(this.backupKey);
    if (savedTest) {
      const parsed = JSON.parse(savedTest);
      this.testForm.patchValue({ classLevel: parsed.classLevel });

      this.questions.clear();
      parsed.questions.forEach((q: any) => {
        const answersArray = this.fb.array(
          q.answers.map((a: any) =>
            this.fb.group({
              answerText: [a.answerText, Validators.required],
              isCorrect: [a.isCorrect],
            })
          ),
          Validators.minLength(2)
        );

        this.questions.push(
          this.fb.group({
            questionText: [q.questionText, Validators.required],
            questionType: [q.questionType],
            answers: answersArray,
          })
        );
      });
    } else {
      this.adaugaIntrebare(); // doar dacă nu există backup
    }

    // Autosave la fiecare 1 minut
    setInterval(() => {
      if (this.testForm.dirty) {
        localStorage.setItem(
          this.backupKey,
          JSON.stringify(this.testForm.value)
        );
        console.log('📦 Backup autosalvat local.');
      }
    }, 60 * 1000); // 1 minut
  }

  get questions() {
    return this.testForm.get('questions') as FormArray;
  }

  getAnswersControls(i: number) {
    return (this.questions.at(i).get('answers') as FormArray).controls;
  }

  selectSingleAnswer(intrebareIndex: number, selectedAnswerIndex: number) {
    const answers = this.questions
      .at(intrebareIndex)
      .get('answers') as FormArray;

    answers.controls.forEach((control, idx) => {
      control.get('isCorrect')?.setValue(idx === selectedAnswerIndex);
    });
  }

  getSelectedIndex(question: any): number {
    const answers = question.get('answers')?.value || [];
    return answers.findIndex((a: any) => a.isCorrect);
  }

  adaugaIntrebare() {
    this.questions.push(
      this.fb.group({
        questionText: ['', Validators.required],
        questionType: ['SINGLE_CHOICE'],
        answers: this.fb.array(
          [
            this.fb.group({
              answerText: ['', Validators.required],
              isCorrect: [false],
            }),
            this.fb.group({
              answerText: ['', Validators.required],
              isCorrect: [false],
            }),
          ],
          Validators.minLength(2)
        ),
      })
    );
  }

  adaugaRaspuns(intrebareIndex: number) {
    const answers = this.questions
      .at(intrebareIndex)
      .get('answers') as FormArray;
    answers.push(this.fb.group({ answerText: [''], isCorrect: [false] }));
  }

  markFormTouched() {
    this.testForm.markAllAsTouched();
    this.questions.controls.forEach((questionGroup) => {
      questionGroup.get('questionText')?.markAsTouched();
      const answers = questionGroup.get('answers') as FormArray;
      answers.controls.forEach((answerGroup) =>
        answerGroup.get('answerText')?.markAsTouched()
      );
    });
  }

  submitTest() {
    if (this.testForm.invalid || this.questions.length === 0) {
      this.snackBar.open(
        '❌ Completează toate întrebările și răspunsurile înainte de salvare.',
        'Închide',
        {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        }
      );
      this.markFormTouched();
      localStorage.removeItem(this.backupKey);
      console.log('📦 Backup eliminat din localStorage.');
      return;
    }

    const questions = this.testForm.value.questions;
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const hasCorrect = q.answers.some((a: any) => a.isCorrect);
      if (!hasCorrect) {
        this.snackBar.open(
          `❌ Adaugă cel puțin un răspuns corect la întrebarea ${i + 1}.`,
          'Închide',
          {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error'],
          }
        );
        return;
      }
    }

    const test = {
      classLevel: this.testForm.value.classLevel,
      lesson: { id: this.lessonId },
      questions: questions,
    };

    this.testService.createTest(test).subscribe({
      next: () => {
        this.snackBar
          .open('✅ Testul a fost adăugat cu succes!', 'Închide', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-success'],
          })
          .afterDismissed()
          .subscribe(() => {
            this.router.navigate([`/lectie/${this.lessonId}`]);
          });
      },
      error: () => {
        this.snackBar.open(
          '❌ Eroare la salvarea testului. Încearcă din nou.',
          'Închide',
          {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error'],
          }
        );
      },
    });
  }

  stergeIntrebare(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmare ștergere',
        message: `Sigur vrei să ștergi întrebarea ${index + 1}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmat) => {
      if (confirmat === true) {
        this.questions.removeAt(index);
      }
    });
  }

  stergeRaspuns(intrebareIndex: number, raspunsIndex: number): void {
    const answers = this.questions
      .at(intrebareIndex)
      .get('answers') as FormArray;

    if (answers.length <= 2) {
      this.snackBar.open(
        '⚠️ Fiecare întrebare trebuie să aibă cel puțin 2 răspunsuri.',
        'Închide',
        { duration: 3000, panelClass: ['snackbar-warning'] }
      );
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmare ștergere',
        message: `Sigur vrei să ștergi răspunsul ${raspunsIndex + 1}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmat) => {
      if (confirmat === true) {
        answers.removeAt(raspunsIndex);
      }
    });
  }
}
