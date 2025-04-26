import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      this.snackBar.open(
        'Trebuie să fii autentificat pentru a accesa această pagină.',
        'Închide',
        {
          duration: 4000,
          panelClass: 'snackbar-warning', // opțional, pentru stiluri
        }
      );

      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
