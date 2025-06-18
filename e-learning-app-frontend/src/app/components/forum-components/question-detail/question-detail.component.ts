import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../types/user.types';

@Component({
  selector: 'app-question-detail',
  standalone: false,
  templateUrl: './question-detail.component.html',
  styleUrl: './question-detail.component.scss',
})
export class QuestionDetailComponent implements OnInit {
  questionId!: string;
  question: any;
  answers: any[] = [];
  answerForm!: FormGroup;
  currentUser!: User;
  modalImage: string | null = null;
  isAdmin: boolean = false;

  onImageClick(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target.tagName === 'IMG') {
      this.modalImage = target.src;
    }
  }

  closeModal(): void {
    this.modalImage = null;
  }
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.questionId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();

    this.authService.getCurrentUser().subscribe((user) => {
      this.isAdmin = user?.userRole === 'ADMIN';
      this.currentUser = user;
      this.initForm();
    });
  }

  initForm(): void {
    this.answerForm = this.fb.group({
      answerHtml: ['', Validators.required],
      author: this.fb.group({
        id: [this.currentUser.id, Validators.required],
      }),
    });
  }

  loadData(): void {
    this.http
      .get(`http://localhost:8080/api/forum/questions/${this.questionId}`)
      .subscribe((q) => (this.question = q));

    this.http
      .get<any[]>(
        `http://localhost:8080/api/forum/questions/${this.questionId}/answers`
      )
      .subscribe((a) => (this.answers = a));
  }

  submitAnswer(): void {
    if (this.answerForm.valid) {
      const answer = this.answerForm.value;
      answer.author.id = this.currentUser.id;

      this.http
        .post(
          `http://localhost:8080/api/forum/questions/${this.questionId}/answers`,
          answer
        )
        .subscribe(() => {
          this.answerForm.reset();
          this.initForm();
          this.loadData();
        });

      setTimeout(() => {
        const last = document.querySelector('.answer:last-child');
        if (last) {
          last.classList.add('animate');
        }
      }, 50);
    }
  }
  deleteAnswer(answerId: string): void {
    if (confirm('Sigur vrei să ștergi acest răspuns?')) {
      this.http
        .delete(`http://localhost:8080/api/forum/answers/${answerId}`)
        .subscribe(() => {
          this.answers = this.answers.filter((a) => a.id !== answerId);
        });
    }
  }
}
