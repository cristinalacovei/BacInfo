import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, map, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserValidatorService {
  private readonly baseUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  validateUsername(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }

      return this.http
        .get<boolean>(`${this.baseUrl}/check-username`, {
          params: { username: control.value },
        })
        .pipe(
          debounceTime(500), // Așteaptă 500ms după ce utilizatorul termină de scris
          map((isAvailable) => (isAvailable ? null : { usernameTaken: true })),
          catchError(() => of(null))
        );
    };
  }

  validateEmail(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }

      return this.http
        .get<boolean>(`${this.baseUrl}/check-email`, {
          params: { email: control.value },
        })
        .pipe(
          debounceTime(500),
          map((isAvailable) => (isAvailable ? null : { emailTaken: true })),
          catchError(() => of(null))
        );
    };
  }
}
