import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../types/user.types';
import { UserValidatorService } from '../../../services/user-validators.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  isLoggedIn = false;
  username: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userValidator: UserValidatorService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.username = this.authService.getUsername();
    }

    this.initForms();
  }

  private initForms(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: [
        '',
        [Validators.required, Validators.minLength(3)],
        [this.usernameValidator.bind(this)],
      ],
      emailAddress: ['', [Validators.required, Validators.email]],
      userRole: ['STUDENT', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private usernameValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.authService
      .checkUsername(control.value)
      .pipe(
        map((isAvailable: boolean) =>
          isAvailable ? null : { usernameTaken: true }
        )
      );
  }

  login(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (token) => {
        localStorage.setItem('token', token);
        this.authService.setIsLoggedIn(true);
        this.username = username;
        this.showSnackbar('Login successful!', 'snackbar-success');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed', error);
        const message =
          error.status === 401
            ? 'Invalid username or password. Please try again.'
            : 'An error occurred. Please try again.';
        this.showSnackbar(message, 'snackbar-error');
      },
    });
  }

  signup(): void {
    if (this.signupForm.invalid) return;

    const user: User = {
      id: '',
      ...this.signupForm.value,
      profileImageUrl: '',
    };

    this.authService.signup(user).subscribe({
      next: () => {
        this.showSnackbar('User registered successfully!', 'snackbar-success');
        this.signupForm.reset();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Signup failed', error);
        const message =
          error.status === 409
            ? 'Email already exists.'
            : 'An error occurred during signup. Please try again.';
        this.showSnackbar(message, 'snackbar-error');
      },
    });
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']).catch((err) => {
      console.error('Failed to navigate to home page:', err);
    });
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass],
    });
  }

  // Getters for controls used in templates
  get usernameControl(): AbstractControl | null {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get signupUsername(): AbstractControl | null {
    return this.signupForm.get('username');
  }
}
