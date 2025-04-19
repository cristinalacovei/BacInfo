import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-complete-profile',
  standalone: false,
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss'],
})
export class CompleteProfileComponent implements OnInit {
  profileForm!: FormGroup;
  token: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');
      if (this.token) {
        localStorage.setItem('token', this.token);
        this.authService.setToken(this.token);
        this.email = this.authService.getEmailFromToken(this.token); // trebuie implementat corect în AuthService
      }
    });

    this.profileForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(6)],
        [this.usernameTakenValidator()],
      ],
      userRole: ['STUDENT', Validators.required],
    });
  }

  usernameTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value;
      if (!username || username.length < 6) {
        return of(null);
      }
      return this.authService
        .checkUsername(username)
        .pipe(
          map((isAvailable: boolean) =>
            isAvailable ? null : { usernameTaken: true }
          )
        );
    };
  }

  submit(): void {
    if (this.profileForm.invalid || !this.email) return;

    const profileData = {
      email: this.email,
      username: this.profileForm.value.username,
      userRole: this.profileForm.value.userRole,
    };

    console.log('Trimitem:', profileData);

    this.authService.completeProfile(profileData).subscribe({
      next: (response) => {
        const newToken = response.token;

        if (newToken) {
          // 🔁 Salvează tokenul nou în localStorage
          localStorage.setItem('token', newToken);
          this.authService.setToken(newToken);

          // 🔁 Reîncarcă userul curent cu tokenul nou
          this.authService.getCurrentUser().subscribe((user) => {
            if (user) {
              localStorage.setItem('username', user.username || '');
              localStorage.setItem('userId', user.id || '');
              localStorage.setItem('userRole', user.userRole || '');
            }

            this.snackBar.open('Profil completat cu succes!', 'Închide', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
            this.router.navigate(['/home']);
          });
        } else {
          // fallback
          this.snackBar.open(
            'Profil completat, dar fără token nou.',
            'Închide',
            {
              duration: 3000,
              panelClass: ['snackbar-warning'],
            }
          );
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        if (
          err.status === 400 &&
          err.error === 'Profilul a fost deja completat.'
        ) {
          this.snackBar.open(
            'Profilul este deja completat. Redirecționare...',
            'Închide',
            {
              duration: 3000,
              panelClass: ['snackbar-warning'],
            }
          );
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open('Eroare la completarea profilului.', 'Închide', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        }
      },
    });
  }
}
