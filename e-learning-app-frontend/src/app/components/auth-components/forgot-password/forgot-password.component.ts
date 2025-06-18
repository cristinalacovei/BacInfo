import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
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
    this.forgotPasswordForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendResetLink(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const { email } = this.forgotPasswordForm.value;

    this.authService.forgotPassword(email).subscribe({
      next: (message: string) => this.showSuccess(message),
      error: () => this.showError(),
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(
      message || '✅ Linkul de resetare a fost trimis!',
      'Închide',
      {
        duration: 3000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );
  }

  private showError(): void {
    this.snackBar.open('❌ A apărut o eroare. Încearcă din nou!', 'Închide', {
      duration: 3000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
