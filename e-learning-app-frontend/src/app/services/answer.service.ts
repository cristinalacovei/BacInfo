import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
}

interface ValidationResult {
  correctAnswers: number;
  totalQuestions: number;
  correctAnswerIds: string[];
  incorrectAnswerIds: string[];
}
@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private apiUrl = 'http://localhost:8080/api/answers';

  constructor(private http: HttpClient) {}
  validateAnswers(selectedAnswerIds: string[]): Observable<ValidationResult> {
    return this.http.post<ValidationResult>(
      `${this.apiUrl}/validate-score`,
      selectedAnswerIds
    );
  }

  getAnswerById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createAnswer(answer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, answer);
  }

  deleteAnswer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAnswersByQuestionId(questionId: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/question/${questionId}`);
  }
}
