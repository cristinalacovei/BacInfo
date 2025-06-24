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
  errorMessage: string | null = null;
  successMessage: string | null = null;
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

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
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

  usernameValidator(
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

  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  signup(): void {
    if (this.signupForm.invalid) {
      return;
    }

    const signupData: User = {
      id: '',
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      username: this.signupForm.value.username,
      emailAddress: this.signupForm.value.emailAddress,
      password: this.signupForm.value.password,
      userRole: this.signupForm.value.userRole,
      profileImageUrl: '', // Default image URL
    };

    this.authService.signup(signupData).subscribe({
      next: () => {
        this.snackBar.open('User registered successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.signupForm.reset();
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Signup failed', error);
        let errorMessage = 'An error occurred during signup. Please try again.';

        if (error.status === 409) {
       
          errorMessage = 'Email already exists.';
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get signupFirstName() {
    return this.signupForm.get('firstName');
  }

  get signupLastName() {
    return this.signupForm.get('lastName');
  }

  get signupUsername() {
    return this.signupForm.get('username');
  }

  get signupEmail() {
    return this.signupForm.get('emailAddress');
  }

  get signupPassword() {
    return this.signupForm.get('password');
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (token) => {
        localStorage.setItem('token', token);
        this.username = username;
        this.authService.setIsLoggedIn(true);
        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed', error);
        const errorMessage =
          error.status === 401
            ? 'Invalid username or password. Please try again.'
            : 'An error occurred. Please try again.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
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

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
