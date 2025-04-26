import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user.types';

@Component({
  selector: 'app-forum-page',
  standalone: false,
  templateUrl: './forum-page.component.html',
  styleUrl: './forum-page.component.scss',
})
export class ForumPageComponent implements OnInit {
  questionForm!: FormGroup;
  allQuestions: any[] = [];
  currentUser!: User;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  };

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      this.isAdmin = user?.userRole === 'ADMIN';
      this.initForm();
    });

    this.loadQuestions();
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      author: this.fb.group({
        id: [this.currentUser.id, Validators.required],
      }),
    });
  }

  submitQuestion(): void {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;

      // te asiguri că setezi ID-ul corect
      formValue.author.id = this.currentUser.id;

      this.http
        .post('http://localhost:8080/api/forum/questions', formValue)
        .subscribe(() => {
          this.questionForm.reset();
          this.initForm(); // resetăm formularul cu userul deja inclus
          this.loadQuestions();
        });
    }
  }

  loadQuestions(): void {
    this.http
      .get<any[]>('http://localhost:8080/api/forum/questions')
      .subscribe((data) => {
        this.allQuestions = data;
      });
  }

  goToQuestion(questionId: string): void {
    this.router.navigate(['/forum', questionId]);
  }

  shouldTruncate(question: any): boolean {
    const plainText = question.questionText.replace(/<[^>]*>/g, '');
    const hasImage = /<img/i.test(question.questionText);
    return plainText.length > 300 || hasImage;
  }

  confirmDelete(id: string, event: Event): void {
    event.stopPropagation(); // evită navigarea la click pe întrebare

    if (confirm('Ești sigur că vrei să ștergi această întrebare?')) {
      this.deleteQuestion(id);
    }
  }

  deleteQuestion(id: string): void {
    this.http
      .delete(`http://localhost:8080/api/forum/questions/${id}`)
      .subscribe(() => {
        this.loadQuestions(); // reîncarcă lista
      });
  }
}
