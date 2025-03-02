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
      const token = params['token']; // Preia token-ul din URL

      if (token) {
        localStorage.setItem('token', token); // Salvează token-ul
        this.authService.setToken(token); // Marchează utilizatorul ca logat
        this.router.navigate(['/home']); // Redirecționează utilizatorul
      } else {
        console.error('Token missing from redirect URL');
        this.router.navigate(['/login']); // Dacă lipsește token-ul, mergi la login
      }
    });
  }
}
