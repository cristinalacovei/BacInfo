import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { User } from './types/user.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'elearning';
  currentYear: number = new Date().getFullYear();
  isLoggedIn = false;
  isAdmin = false;
  isSidebarOpen = false;
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.getIsLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

      if (loggedIn) {
        this.authService.getCurrentUser().subscribe((user) => {
          this.isAdmin = user?.userRole === 'ADMIN';
          this.user = user; // ✅ păstrăm userul complet pt. avatar
        });
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']).catch((err) => {
      console.error('Failed to navigate to login page:', err);
    });
  }

  navigateToProfile(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/profile']).catch((err) => {
        console.error('Failed to navigate to profile page:', err);
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Login Required',
          message: 'You need to log in to access your profile.',
          singleButton: true,
        },
      });
    }
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        singleButton: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['']);
      }
    });
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/default-avatar.png'; // fallback default
  }
}
