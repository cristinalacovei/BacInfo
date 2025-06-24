import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ForumService } from '../../../services/forum.service';
import { User } from '../../../types/user.types';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

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
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  sortAsc: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private forumService: ForumService,
    private dialog: MatDialog
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
      formValue.author.id = this.currentUser.id;

      this.forumService.postQuestion(formValue).subscribe(() => {
        this.questionForm.reset();
        this.initForm();
        this.loadQuestions();
      });
    }
  }

  loadQuestions(): void {
    this.forumService.getAllQuestions().subscribe((data) => {
      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return this.sortAsc ? dateA - dateB : dateB - dateA;
      });

      this.totalPages = Math.ceil(sorted.length / this.pageSize);
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;

      this.allQuestions = sorted.slice(startIndex, endIndex);
    });
  }

  deleteQuestion(id: string): void {
    this.forumService.deleteQuestion(id).subscribe(() => {
      this.loadQuestions();
    });
  }

  confirmDelete(id: string, event: Event): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmare ștergere',
        message: 'Ești sigur că vrei să ștergi această întrebare?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteQuestion(id);
      }
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

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadQuestions();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadQuestions();
    }
  }

  toggleSortOrder(): void {
    this.sortAsc = !this.sortAsc;
    this.currentPage = 1;
    this.loadQuestions();
  }
}
