import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

      if (token) {
        localStorage.setItem('token', token);
        this.authService.setToken(token);

        this.authService.getCurrentUser().subscribe((user) => {
          if (user) {
            localStorage.setItem('username', user.username || '');
            localStorage.setItem('userId', user.id || '');
            localStorage.setItem('userRole', user.userRole || '');

            // 🔥 Modificare aici
            if (
              isIncomplete ||
              !user.userRole ||
              user.userRole === 'PENDING' ||
              user.username === null
            ) {
              this.router.navigate(['/complete-profile'], {
                queryParams: { token },
              });
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            this.router.navigate(['/login']);
          }
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
