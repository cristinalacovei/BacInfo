import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
interface Question {
  id: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  answers: Answer[];
  selectedAnswer?: string; // ✅ Pentru SINGLE_CHOICE
}
interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
  isSelected?: boolean; // ✅ Adăugat pentru MULTIPLE_CHOICE
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private baseUrl = `${environment.apiUrl}/api/questions`;

  constructor(private http: HttpClient) {}

  getQuestionsByTestId(testId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/test/${testId}`);
  }

  getQuestionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createQuestion(question: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, question);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getRandomQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/random`);
  }
}
