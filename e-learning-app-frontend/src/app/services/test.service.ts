import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TestEntity {
  id: string;
  classLevel: number;
  questions: any[];
}

@Injectable({
  providedIn: 'root', // 🔥 Asigură-te că este specificat
})
export class TestService {
  private apiUrl = 'http://localhost:8080/api/tests'; // Endpoint backend pentru teste

  constructor(private http: HttpClient) {}

  getTestById(testId: string): Observable<TestEntity> {
    return this.http.get<TestEntity>(`${this.apiUrl}/${testId}`);
  }
  submitTest(testId: string, userAnswers: any[]): Observable<any> {
    return this.http.post(`/api/tests/${testId}/submit`, userAnswers);
  }
}
