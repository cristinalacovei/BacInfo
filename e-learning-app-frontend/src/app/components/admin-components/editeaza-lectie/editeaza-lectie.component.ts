import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LectiiService } from '../../../services/lectii.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-editeaza-lectie',
  standalone: false,
  templateUrl: './editeaza-lectie.component.html',
  styleUrl: './editeaza-lectie.component.scss',
})
export class EditeazaLectieComponent implements OnInit, OnDestroy {
  lessonForm!: FormGroup;
  lessonId = '';
  autoSaveInterval: any;

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
    private fb: FormBuilder,
    private lectiiService: LectiiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.lessonId = this.route.snapshot.paramMap.get('id') || '';

    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.lectiiService.getLectieById(this.lessonId).subscribe((lesson) => {
      this.lessonForm.patchValue(lesson);

      const backup = localStorage.getItem(this.backupKey);
      if (backup) {
        try {
          this.lessonForm.patchValue(JSON.parse(backup));
          this.snackBar.open('🕒 Backup încărcat automat.', '', {
            duration: 3000,
            panelClass: 'snackbar-success',
          });
        } catch (e) {
          console.warn('Backup invalid:', e);
        }
      }
    });

    this.autoSaveInterval = setInterval(() => {
      if (this.lessonForm.valid) {
        localStorage.setItem(
          this.backupKey,
          JSON.stringify(this.lessonForm.value)
        );
      }
    }, 60000); // la fiecare 60 secunde
  }

  get backupKey(): string {
    return `lesson-backup-${this.lessonId}`;
  }

  saveLesson(): void {
    if (this.lessonForm.invalid) {
      this.lessonForm.markAllAsTouched();
      this.snackBar.open('⚠️ Completează toate câmpurile!', '', {
        duration: 3000,
        panelClass: 'snackbar-error',
      });
      return;
    }

    const updatedLesson = { id: this.lessonId, ...this.lessonForm.value };
    this.lectiiService.updateLectie(updatedLesson).subscribe(() => {
      localStorage.removeItem(this.backupKey);
      this.snackBar.open('✅ Lecția a fost actualizată!', '', {
        duration: 3000,
        panelClass: 'snackbar-success',
      });
      this.router.navigate(['/lectie', this.lessonId]);
    });
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
  }
}
