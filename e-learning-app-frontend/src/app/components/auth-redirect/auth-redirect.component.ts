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

      if (token) {
        localStorage.setItem('token', token);
        this.authService.setToken(token);

        // 🔥 Apelează backend-ul pentru a obține userul curent (bazat pe token)
        this.authService.getCurrentUser().subscribe((user) => {
          if (user) {
            localStorage.setItem('username', user.username);
            localStorage.setItem('userId', user.id); // 🔥 adaugă și ID-ul!
          }

          this.router.navigate(['/home']);
        });
      } else {
        console.error('Token missing from redirect URL');
        this.router.navigate(['/login']);
      }
    });
  }
}
