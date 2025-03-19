import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LessonContent {
  contentType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'SCHEME';
  textContent?: string;
  contentUrl?: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content?: string;
  classLevel: number;
}

@Injectable({
  providedIn: 'root',
})
export class LectiiService {
  private apiUrl = 'http://localhost:8080/api/lessons'; // Endpoint pentru lecții
  private lessonContentUrl = 'http://localhost:8080/api/lesson-content'; // Endpoint pentru conținut

  constructor(private http: HttpClient) {}

  getLectii(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}`);
  }

  getLectiiByClass(classLevel: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/class/${classLevel}`);
  }

  getLectieById(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`);
  }

  getLessonContentByLessonId(lessonId: string): Observable<LessonContent[]> {
    return this.http.get<LessonContent[]>(
      `${this.lessonContentUrl}/lesson/${lessonId}`
    );
  }

  updateLessonContent(
    lessonId: string,
    contents: LessonContent[]
  ): Observable<any> {
    return this.http.post(
      `${this.lessonContentUrl}/lesson/${lessonId}`,
      contents
    );
  }

  updateLectie(lesson: Lesson): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}/${lesson.id}`, lesson);
  }
}
