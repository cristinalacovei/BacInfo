import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || null;
      if (!this.token) {
        this.snackBar.open('Token invalid sau lipsă!', 'Închide', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      }
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid || !this.token) return;

    const newPassword = this.resetPasswordForm.value.newPassword;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response: any) => {
        // Aici aștepți un obiect JSON
        console.log('Răspuns de la backend:', response);
        this.snackBar.open(
          response.message || 'Parola a fost resetată cu succes!',
          'Închide',
          { duration: 3000 }
        );
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Eroare:', error);
        this.snackBar.open(
          error.error?.message || 'Eroare la resetarea parolei!',
          'Închide',
          { duration: 3000 }
        );
      },
    });
  }
}
