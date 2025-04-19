import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../types/user.types';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string; // ID-ul utilizatorului
  email?: string; // pentru Google OAuth
  username?: string; // adăugat manual de noi în JWT
  userRole?: string; // adăugat manual de noi în JWT
  [key: string]: any; // fallback pentru orice altceva
}

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

  getEmailFromToken(token: string): string | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.email || decoded.sub || null;
    } catch (e) {
      console.error('Token decode error', e);
      return null;
    }
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

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true);

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (decoded.username) {
        localStorage.setItem('username', decoded.username);
      }

      if (decoded.sub) {
        localStorage.setItem('userId', decoded.sub);
      }

      if (decoded.userRole) {
        localStorage.setItem('userRole', decoded.userRole);
      }
    } catch (e) {
      console.error('Eroare la extragerea datelor din token', e);
    }
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
    return this.http.get<User>(`${this.baseUrl}/api/users/me`);
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

  forgotPassword(email: string): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/api/auth/forgot-password`,
      { email },
      { responseType: 'text' as 'json' }
    );
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/api/auth/reset-password`,
      { token, newPassword },
      { responseType: 'text' as 'json' }
    );
  }
  setUsername(username: string): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/api/users/set-username`,
      null,
      {
        params: { username },
      }
    );
  }
  completeProfile(data: {
    email: string;
    username: string;
    userRole: string;
  }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.baseUrl}/api/auth/complete-profile`,
      data
    );
  }
}
