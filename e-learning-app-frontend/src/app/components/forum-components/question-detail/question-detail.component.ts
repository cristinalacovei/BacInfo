import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ForumService } from '../../../services/forum.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
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

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private forumService: ForumService,
    private dialog: MatDialog
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
    this.forumService.getQuestionById(this.questionId).subscribe((q) => {
      this.question = q;
    });

    this.forumService.getAnswersForQuestion(this.questionId).subscribe((a) => {
      this.answers = a;
    });
  }

  submitAnswer(): void {
    if (this.answerForm.valid) {
      const answer = this.answerForm.value;
      answer.author.id = this.currentUser.id;

      this.forumService.postAnswer(this.questionId, answer).subscribe(() => {
        this.answerForm.reset();
        this.initForm();
        this.loadData();

        setTimeout(() => {
          const last = document.querySelector('.answer:last-child');
          if (last) last.classList.add('animate');
        }, 50);
      });
    }
  }

  deleteAnswer(answerId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmare ștergere',
        message: 'Sigur vrei să ștergi acest răspuns?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.forumService.deleteAnswer(answerId).subscribe(() => {
          this.answers = this.answers.filter((a) => a.id !== answerId);
        });
      }
    });
  }

  onImageClick(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target.tagName === 'IMG') {
      this.modalImage = target.src;
    }
  }

  closeModal(): void {
    this.modalImage = null;
  }
}
