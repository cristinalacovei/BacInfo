import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LectiiService } from '../../services/lectii.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.isAdmin = user?.userRole === 'ADMIN';
      },
      (err) => {
        console.error('Eroare la verificarea rolului:', err);
        this.isAdmin = false;
      }
    );

    const lectieId = this.route.snapshot.paramMap.get('id');
    if (lectieId) {
      this.lectiiService.getLectieById(lectieId).subscribe((data) => {
        this.lectie = data;
        this.pagini = this.lectie?.content
          ? this.lectie.content.split('&lt;!-- PAGE BREAK --&gt;')
          : [];

        // Obține testul asociat lecției
        this.lectiiService.getLessonTest(this.lectie).subscribe((test) => {
          if (test) {
            this.testId = test.id;
          }
        });
        // Inițializează formularul cu datele lecției
        this.lessonForm = this.fb.group({
          title: [this.lectie?.title || ''],
          description: [this.lectie?.description || ''],
          content: [this.lectie?.content || ''],
        });
      });
    }
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
}
