import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestEntity } from '../types/test.types';
import { NewTestPayload } from '../types/test.types';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = 'http://localhost:8080/api/tests';

  constructor(private http: HttpClient) {}

  getTestById(testId: string): Observable<TestEntity> {
    return this.http.get<TestEntity>(`${this.apiUrl}/${testId}`);
  }
  submitTest(testId: string, userAnswers: any[]): Observable<any> {
    return this.http.post(`/api/tests/${testId}/submit`, userAnswers);
  }

  updateTest(test: TestEntity): Observable<TestEntity> {
    return this.http.put<TestEntity>(`${this.apiUrl}/${test.id}`, test);
  }

  getLessonIdByTestId(testId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${testId}/lesson-id`);
  }
  createTest(test: NewTestPayload): Observable<TestEntity> {
    return this.http.post<TestEntity>(this.apiUrl, test);
  }
  deleteTest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
