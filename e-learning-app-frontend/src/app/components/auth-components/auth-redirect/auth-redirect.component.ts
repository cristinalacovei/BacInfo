import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth-redirect',
  standalone: false,
  templateUrl: './auth-redirect.component.html',
  styleUrl: './auth-redirect.component.scss',
})
export class AuthRedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const isIncomplete = params['incomplete'] === 'true';

      if (!token) {
        this.router.navigate(['/login']);
        return;
      }

      this.handleToken(token, isIncomplete);
    });
  }

  private handleToken(token: string, isIncomplete: boolean): void {
    localStorage.setItem('token', token);
    this.authService.setToken(token);

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(['/login']);
          return;
        }

        localStorage.setItem('username', user.username || '');
        localStorage.setItem('userId', user.id || '');
        localStorage.setItem('userRole', user.userRole || '');

        const profileIncomplete =
          isIncomplete ||
          !user.userRole ||
          user.userRole === 'PENDING' ||
          user.username === null;

        this.router.navigate(
          [profileIncomplete ? '/complete-profile' : '/home'],
          profileIncomplete ? { queryParams: { token } } : undefined
        );
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
