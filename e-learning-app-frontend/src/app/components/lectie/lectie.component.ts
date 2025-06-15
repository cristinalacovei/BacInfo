import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LectiiService } from '../../services/lectii.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestService } from '../../services/test.service';
import jsPDF from 'jspdf';
import { addRobotoFont } from '../../../../src/assets/fonts/roboto-regular.js';
import { Lesson } from '../../types/lesson.types';

@Component({
  selector: 'app-lectie',
  standalone: false,
  templateUrl: './lectie.component.html',
  styleUrl: './lectie.component.scss',
})
export class LectieComponent implements OnInit {
  lectie: Lesson | null = null;
  pagini: string[] = [];
  paginaCurenta = 0;
  testId: string | null = null;
  isAdmin = false;
  isTeacher = false;

  constructor(
    private route: ActivatedRoute,
    private lectiiService: LectiiService,
    private authService: AuthService,
    private testService: TestService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.isAdmin = user?.userRole === 'ADMIN';
      this.isTeacher = user?.userRole === 'TEACHER';
    });

    this.route.params.subscribe((params) => {
      const lectieId = params['id'];
      if (lectieId) this.incarcaLectie(lectieId);
    });
  }

  private incarcaLectie(id: string): void {
    this.lectiiService.getLectieById(id).subscribe((data) => {
      this.lectie = data;
      this.pagini = data.content
        ? data.content.split('&lt;!-- PAGE BREAK --&gt;')
        : [];

      this.lectiiService.getLessonTest(data).subscribe({
        next: (test) => (this.testId = test?.id || null),
        error: () => (this.testId = null),
      });
    });
  }

  paginaAnterioara(): void {
    if (this.paginaCurenta > 0) this.paginaCurenta--;
  }

  paginaUrmatoare(): void {
    if (this.paginaCurenta < this.pagini.length - 1) this.paginaCurenta++;
  }

  startTest(): void {
    if (this.testId) this.router.navigate([`/test/${this.testId}`]);
  }

  exportTestAsPDF(): void {
    if (!this.testId || !this.lectie) return;

    this.testService.getTestById(this.testId).subscribe((test) => {
      const doc = new jsPDF();
      addRobotoFont(doc);
      doc.setFont('Roboto');
      doc.setFontSize(12);
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 15;

      doc.text('Numele elevului: ___________________________', 15, y);
      doc.text('Clasa: ___________', 15, y + 7);
      doc.text(
        `Data: ${new Date().toLocaleDateString('ro-RO')}`,
        pageWidth - 60,
        y
      );
      y += 20;

      doc.setFontSize(18);
      doc.text(this.lectie!.title, pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(12);
      const desc = doc.splitTextToSize(
        this.lectie!.description,
        pageWidth - 30
      );
      doc.text(desc, 15, y);
      y += desc.length * 7;

      doc.line(15, y, pageWidth - 15, y);
      y += 10;

      doc.text(
        'Completează fiecare întrebare alegând varianta corectă:',
        15,
        y
      );
      y += 12;

      test.questions.forEach((q: any, i: number) => {
        const question = doc.splitTextToSize(
          `${i + 1}. ${q.questionText}`,
          pageWidth - 30
        );
        doc.text(question, 15, y);
        y += question.length * 8;

        q.answers.forEach((a: any, j: number) => {
          const answer = doc.splitTextToSize(
            `${String.fromCharCode(65 + j)}. ${a.answerText}`,
            pageWidth - 35
          );
          doc.text(answer, 20, y);
          y += answer.length * 6;
        });

        y += 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      doc.save(`${this.lectie!.title.replace(/\s+/g, '_')}_test.pdf`);
    });
  }

  confirmaStergereTest(): void {
    if (!this.testId) return;

    this.dialog
      .open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Confirmare ștergere',
          message:
            'Ești sigur că vrei să ștergi testul asociat acestei lecții?',
          singleButton: false,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.testService.deleteTest(this.testId!).subscribe({
            next: () => {
              this.snackBar.open('✅ Testul a fost șters cu succes!', '', {
                duration: 3000,
                panelClass: 'snackbar-success',
              });
              this.testId = '';
            },
            error: () => {
              this.snackBar.open('❌ Eroare la ștergerea testului.', '', {
                duration: 3000,
                panelClass: 'snackbar-error',
              });
            },
          });
        }
      });
  }
}
