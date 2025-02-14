import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'online-shop';
  currentYear: number = new Date().getFullYear();
  isLoggedIn = false;
  isAdmin = false;
  cartItemCount = 0;
  isDarkMode: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.setTheme();
    }

    this.authService.getIsLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

      if (loggedIn) {
        this.authService.getCurrentUser().subscribe((user) => {
          this.isAdmin = user.userRole === 'ADMIN';
        });
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.setTheme();
  }

  setTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark'); // Save user's preference in local storage
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light'); // Save user's preference in local storage
    }
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
        this.cartItemCount = 0;
        this.router.navigate(['']);
      }
    });
  }
  navigateToCart(): void {
    if (!this.isLoggedIn) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Login Required',
          message: 'You need to log in to access the shopping cart.',
          singleButton: true,
        },
      });
    } else if (this.isAdmin) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Access Denied',
          message: 'Admins cannot access the shopping cart.',
          singleButton: true,
        },
      });
    } else {
      this.router.navigate(['/cart']).catch((err) => {
        console.error('Failed to navigate to shopping cart:', err);
      });
    }
  }

  navigateToProducts(): void {
    if (!this.isLoggedIn) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Login Required',
          message: 'You need to log in to access the product list.',
          singleButton: true,
        },
      });
    } else {
      this.router.navigate(['/products']);
    }
  }

  navigateToOrders(): void {
    if (!this.isLoggedIn) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Login Required',
          message: 'You need to log in to access the orders list.',
          singleButton: true,
        },
      });
    } else if (!this.isAdmin) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Access Denied',
          message: 'Only admins can access the orders list.',
          singleButton: true,
        },
      });
    } else {
      this.router.navigate(['/orders']).catch((err) => {
        console.error('Failed to navigate to orders list:', err);
      });
    }
  }
}
