import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  lessonForm!: FormGroup;
  savedLesson: {
    title: string;
    description: string;
    content: string;
    classLevel: number;
  } | null = null;

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

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required], // Descrierea lecției
      content: ['', Validators.required],
      classLevel: ['', Validators.required], // Clasa la care este asignată lecția
    });
  }

  saveLesson(): void {
    if (this.lessonForm.valid) {
      this.savedLesson = this.lessonForm.value;

      console.log('Lecție salvată:', this.savedLesson);

      // Trimiterea către backend
      this.http
        .post('http://localhost:8080/api/lessons', this.savedLesson)
        .subscribe(
          (response) => {
            console.log('Lecția a fost salvată cu succes!', response);
            this.lessonForm.reset(); // Resetăm formularul după salvare
          },
          (error) => {
            console.error('Eroare la salvarea lecției:', error);
          }
        );
    }
  }
}
