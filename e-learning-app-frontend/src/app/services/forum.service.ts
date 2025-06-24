import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private baseUrl = 'http://localhost:8080/api/forum/questions';

  constructor(private http: HttpClient) {}

  getAllQuestions(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  postQuestion(question: any): Observable<any> {
    return this.http.post(this.baseUrl, question);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  getQuestionById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getAnswersForQuestion(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${id}/answers`);
  }

  postAnswer(questionId: string, answer: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${questionId}/answers`, answer);
  }

  deleteAnswer(answerId: string): Observable<any> {
    return this.http.delete(
      `http://localhost:8080/api/forum/answers/${answerId}`
    );
  }
}
