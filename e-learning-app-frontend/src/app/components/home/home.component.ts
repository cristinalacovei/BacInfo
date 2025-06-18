import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.isAdmin = user?.userRole === 'ADMIN';
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToLessons(): void {
    this.navigateTo('/lectii');
  }

  navigateToTests(): void {
    this.navigateTo('/test-general');
  }

  navigateToForum(): void {
    this.navigateTo('/forum');
  }

  navigateToUserStats(): void {
    this.navigateTo('/admin/users');
  }
}
