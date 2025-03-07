import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LectiiService } from '../../services/lectii.service';

interface LessonContent {
  contentType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'SCHEME';
  textContent?: string;
  contentUrl?: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
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
  lessonContents: LessonContent[] = [];
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private lectiiService: LectiiService
  ) {}

  ngOnInit(): void {
    const lectieId = this.route.snapshot.paramMap.get('id');
    if (lectieId) {
      this.lectiiService.getLectieById(lectieId).subscribe((data) => {
        this.lectie = data;
      });

      this.lectiiService
        .getLessonContentByLessonId(lectieId)
        .subscribe((contentData) => {
          this.lessonContents = contentData;
        });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  updateTitle(event: any) {
    if (this.lectie) {
      this.lectie.title = event.target.innerText;
    }
  }

  updateDescription(event: any) {
    if (this.lectie) {
      this.lectie.description = event.target.innerText;
    }
  }

  updateTextContent(event: any, index: number) {
    this.lessonContents[index].textContent = event.target.innerText;
  }

  updateContentUrl(index: number) {
    this.lessonContents[index].contentUrl =
      this.lessonContents[index].contentUrl;
  }

  addContent() {
    this.lessonContents.push({
      contentType: 'TEXT',
      textContent: '',
      contentUrl: '',
    });
  }

  deleteContent(index: number) {
    this.lessonContents.splice(index, 1);
  }

  saveChanges() {
    if (this.lectie) {
      this.lectiiService
        .updateLessonContent(this.lectie.id, this.lessonContents)
        .subscribe(() => {
          alert('Modificările au fost salvate!');
          this.editMode = false;
        });
    }
  }
}
