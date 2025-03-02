import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../types/user.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  // 🔥 Corectăm inițializarea isLoggedInSubject
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // UI ascultă schimbările

  constructor(private http: HttpClient) {}

  private checkToken(): boolean {
    return !!localStorage.getItem('token');
  }

  signup(userData: Partial<User>): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users`, userData);
  }

  login(username: string, password: string): Observable<string> {
    const loginEndpoint = `${this.baseUrl}/api/auth/token`;
    return this.http
      .post<string>(
        loginEndpoint,
        { username, password },
        { responseType: 'text' as 'json' }
      )
      .pipe(
        tap((token: string) => {
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          this.isLoggedInSubject.next(true); // 🔥 UI-ul se va actualiza automat
        })
      );
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true); // 🔥 UI-ul se actualizează fără refresh
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isLoggedInSubject.next(false); // 🔥 UI-ul va reacționa instant la deconectare
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value; // ✅ Se bazează pe BehaviorSubject
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setIsLoggedIn(loggedIn: boolean): void {
    this.isLoggedInSubject.next(loggedIn);
  }

  getUserDetails(userId: string): Observable<User> {
    const userDetailsEndpoint = `${this.baseUrl}/api/users/${userId}`;
    return this.http.get<User>(userDetailsEndpoint);
  }

  getCurrentUser(): Observable<User> {
    const username = this.getUsername();

    if (!username) {
      throw new Error('User not logged in');
    }
    return this.http.get<User>(
      `${this.baseUrl}/api/users/username/${username}`
    );
  }
  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/api/users/check-username`, {
      params: { username },
    });
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/api/users/check-email`, {
      params: { email },
    });
  }
}
