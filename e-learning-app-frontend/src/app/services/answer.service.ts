import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ScoreResponse {
  correctAnswers: number;
  totalQuestions: number;
}

interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
}

interface ValidationResult {
  correctAnswers: number;
  totalQuestions: number;
  correctAnswerIds: string[]; // ✅ Liste cu ID-urile răspunsurilor corecte
  incorrectAnswerIds: string[]; // ✅ Liste cu ID-urile răspunsurilor greșite
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

  getAnswersByQuestionId(questionId: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/question/${questionId}`);
  }
}
