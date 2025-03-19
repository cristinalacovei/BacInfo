import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LectiiService } from '../../services/lectii.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const lectieId = this.route.snapshot.paramMap.get('id');
    if (lectieId) {
      this.lectiiService.getLectieById(lectieId).subscribe((data) => {
        this.lectie = data;

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
}
