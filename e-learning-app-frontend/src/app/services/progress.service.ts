import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private apiUrl = 'http://localhost:8080/api/progress';

  constructor(private http: HttpClient) {}

  saveProgress(progress: any) {
    return this.http.post(`${this.apiUrl}`, progress);
  }
}
