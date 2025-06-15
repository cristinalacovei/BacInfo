import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content?: string;
  classLevel: number;
  testId?: string;
}
interface TestEntity {
  id: string;
  classLevel: number;
  questions?: Question[];
}

interface Question {
  id: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  answers?: Answer[];
}

interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LectiiService {
  private apiUrl = 'http://localhost:8080/api/lessons'; // Endpoint pentru lecții
  private lessonContentUrl = 'http://localhost:8080/api/lesson-content'; // Endpoint pentru conținut
  private baseUrl = 'http://localhost:8080'; // URL-ul backend-ului tău

  constructor(private http: HttpClient) {}

  getLatestProgress(
    userId: string
  ): Observable<{ lessonId: string; score: number; completedAt: string }[]> {
    return this.http.get<
      { lessonId: string; score: number; completedAt: string }[]
    >(`${this.baseUrl}/api/progress/latest-score`, { params: { userId } });
  }

  getLectii(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}`);
  }

  getLectiiByClass(classLevel: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/class/${classLevel}`);
  }

  getLectieById(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`);
  }

  stergeLectie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateLectie(lesson: Lesson): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}/${lesson.id}`, lesson);
  }

  getLessonTest(lesson: Lesson): Observable<TestEntity> {
    console.log('Requesting test for lesson:', lesson);
    return this.http.get<TestEntity>(`${this.apiUrl}/${lesson.id}/test`);
  }
}
