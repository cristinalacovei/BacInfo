import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../types/user.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; // URL-ul backend-ului tău

  constructor(private http: HttpClient) {}

  // Obține utilizatorul după ID
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Actualizează utilizatorul
  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user);
  }
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(
      `http://localhost:8080/api/users/username/${username}`
    );
  }
  uploadProfilePicture(userId: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.apiUrl}/upload-profile-picture/${userId}`,
      formData,
      {
        responseType: 'text', // pentru că backendul returnează un string (linkul imaginii)
      }
    );
  }
}
