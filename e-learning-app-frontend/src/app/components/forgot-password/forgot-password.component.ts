import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  sendResetLink() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (response: string) => {
        // Aici aștepți un răspuns de tip string
        console.log('Răspuns de la backend:', response);
        this.snackBar.open(
          response || 'Un email cu link-ul de resetare a fost trimis!',
          'Închide',
          {
            duration: 3000,
            panelClass: ['snackbar-success'],
          }
        );
      },
      error: () => {
        this.snackBar.open('A apărut o eroare. Încearcă din nou!', 'Închide', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }
}
