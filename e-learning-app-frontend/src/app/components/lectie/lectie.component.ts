import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LectiiService } from '../../services/lectii.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestService } from '../../services/test.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addRobotoFont } from '../../../../src/assets/fonts/roboto-regular.js';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content?: string; // Am adăugat câmpul content
  classLevel: number;
}

@Component({
  selector: 'app-lectie',
  standalone: false,
  templateUrl: './lectie.component.html',
  styleUrl: './lectie.component.scss',
})
export class LectieComponent implements OnInit {
  lectie: Lesson | null = null;
  isEditing = false;
  lessonForm!: FormGroup;
  pagini: string[] = [];
  paginaCurenta = 0;
  testId: string | null = null;
  isAdmin: boolean = false;
  isTeacher: boolean = false;

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video'],
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private lectiiService: LectiiService,
    private authService: AuthService,
    private testService: TestService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.isAdmin = user?.userRole === 'ADMIN';
        this.isTeacher = user?.userRole === 'TEACHER';
      },
      (err) => {
        console.error('Eroare la verificarea rolului:', err);
        this.isAdmin = false;
      }
    );

    // 🔁 Important: subscribe la params în loc de snapshot
    this.route.params.subscribe((params) => {
      const lectieId = params['id'];
      if (lectieId) {
        this.incarcaLectie(lectieId); // 🔄 Refactorizează în funcție separată
      }
    });
  }

  // 🔧 Funcție separată pentru a încărca lecția
  private incarcaLectie(id: string): void {
    this.lectiiService.getLectieById(id).subscribe((data) => {
      this.lectie = data;
      this.pagini = this.lectie?.content
        ? this.lectie.content.split('&lt;!-- PAGE BREAK --&gt;')
        : [];

      // Obține testul asociat lecției
      this.lectiiService.getLessonTest(this.lectie).subscribe({
        next: (test) => {
          this.testId = test?.id || null;
        },
        error: (err) => {
          console.warn('Niciun test asociat lecției sau eroare:', err);
          this.testId = null;
        },
      });

      this.lessonForm = this.fb.group({
        title: [this.lectie?.title || ''],
        description: [this.lectie?.description || ''],
        content: [this.lectie?.content || ''],
      });
    });
  }

  exportTestAsPDF(): void {
    if (!this.testId || !this.lectie) return;

    this.testService.getTestById(this.testId).subscribe((test) => {
      const doc = new jsPDF();
      addRobotoFont(doc);
      doc.setFont('Roboto');
      doc.setFontSize(12);

      const pageWidth = doc.internal.pageSize.getWidth();
      const marginLeft = 15;
      let currentY = 15;

      // 🟡 Numele elevului și clasa
      doc.text(
        'Numele elevului: ___________________________',
        marginLeft,
        currentY
      );
      doc.text('Clasa: ___________', marginLeft, currentY + 7);

      // 🟡 Data în colț dreapta
      const currentDate = new Date().toLocaleDateString('ro-RO');
      doc.text(`Data: ${currentDate}`, pageWidth - 60, currentY);

      // 🟣 Titlul lecției centrat
      currentY += 20;
      doc.setFontSize(18);
      doc.setFont('Roboto');
      doc.text(this.lectie!.title, pageWidth / 2, currentY, {
        align: 'center',
      });
      currentY += 10;

      // 🟠 Descriere wrap
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(12);
      const descriere = this.lectie!.description || '';
      const wrappedDescription = doc.splitTextToSize(
        descriere,
        pageWidth - 2 * marginLeft
      );
      doc.text(wrappedDescription, marginLeft, currentY);
      currentY += wrappedDescription.length * 7;

      // 🔻 Linie orizontală
      doc.setLineWidth(0.5);
      doc.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
      currentY += 10;

      // 📝 Instrucțiuni
      doc.setFont('Roboto', 'normal');
      doc.text(
        'Completează fiecare întrebare alegând varianta corectă:',
        marginLeft,
        currentY
      );
      currentY += 12;

      // 🔁 Întrebări și răspunsuri
      test.questions.forEach((q: any, index: number) => {
        // Întrebare
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(13);
        const questionText = `${index + 1}. ${q.questionText}`;
        const wrappedQuestion = doc.splitTextToSize(
          questionText,
          pageWidth - 2 * marginLeft
        );
        doc.text(wrappedQuestion, marginLeft, currentY);
        currentY += wrappedQuestion.length * 8;

        // Răspunsuri
        doc.setFont('Roboto', 'normal');
        doc.setFontSize(12);
        q.answers.forEach((a: any, idx: number) => {
          const answerText = `${String.fromCharCode(65 + idx)}. ${
            a.answerText
          }`;
          const wrappedAnswer = doc.splitTextToSize(
            answerText,
            pageWidth - 2 * marginLeft - 5
          );
          doc.text(wrappedAnswer, marginLeft + 5, currentY);
          currentY += wrappedAnswer.length * 6;
        });

        currentY += 10;

        // 📄 Dacă trece de pagină
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
      });

      // 💾 Salvare fișier
      const fileName = `${this.lectie!.title.replace(/\s+/g, '_')}_test.pdf`;
      doc.save(fileName);
    });
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (this.lectie) {
      this.lessonForm.patchValue({
        title: this.lectie.title,
        description: this.lectie.description,
        content: this.lectie.content,
      });
    }
  }

  saveLesson() {
    if (this.lectie) {
      const updatedLesson = {
        ...this.lectie,
        ...this.lessonForm.value,
      };

      this.lectiiService.updateLectie(updatedLesson).subscribe(() => {
        this.lectie = updatedLesson;
        this.isEditing = false;
      });
    }
  }
  paginaAnterioara() {
    if (this.paginaCurenta > 0) {
      this.paginaCurenta--;
    }
  }

  paginaUrmatoare() {
    if (this.paginaCurenta < this.pagini.length - 1) {
      this.paginaCurenta++;
    }
  }
  startTest() {
    console.log('Navigating to test with ID:', this.testId);
    if (this.testId) {
      this.router.navigate([`/test/${this.testId}`]);
    } else {
      console.error('Test ID is null or undefined!');
    }
  }

  confirmaStergereTest(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmare ștergere',
        message: 'Ești sigur că vrei să ștergi testul asociat acestei lecții?',
        singleButton: false,
      },
    });

    dialogRef.afterClosed().subscribe((confirmat) => {
      if (confirmat && this.testId) {
        this.testService.deleteTest(this.testId).subscribe({
          next: () => {
            this.snackBar.open('✅ Testul a fost șters cu succes!', '', {
              duration: 3000,
              panelClass: 'snackbar-success',
            });
            this.testId = ''; // eliminăm vizual testul
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
