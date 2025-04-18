import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-adauga-test',
  standalone: false,
  templateUrl: './adauga-test.component.html',
  styleUrl: './adauga-test.component.scss',
})
export class AdaugaTestComponent implements OnInit {
  testForm!: FormGroup;
  lessonId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('lessonId') || '';

    this.testForm = this.fb.group({
      classLevel: [''],
      questions: this.fb.array([]),
    });

    this.adaugaIntrebare(); // default
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
        questionText: [''],
        questionType: ['SINGLE_CHOICE'],
        answers: this.fb.array([
          this.fb.group({ answerText: [''], isCorrect: [false] }),
          this.fb.group({ answerText: [''], isCorrect: [false] }),
        ]),
      })
    );
  }

  adaugaRaspuns(intrebareIndex: number) {
    const answers = this.questions
      .at(intrebareIndex)
      .get('answers') as FormArray;
    answers.push(this.fb.group({ answerText: [''], isCorrect: [false] }));
  }

  submitTest() {
    const test = {
      classLevel: 9,
      lesson: { id: this.lessonId },
      questions: this.testForm.value.questions,
    };

    this.testService.createTest(test).subscribe({
      next: () => {
        alert('Test adăugat cu succes!');
        this.router.navigate([`/lectie/${this.lessonId}`]);
      },
      error: (err) => {
        console.error(err);
        alert('Eroare la salvarea testului');
      },
    });
  }
}
