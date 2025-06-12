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
  isAdmin = false;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.isAdmin = user?.userRole === 'ADMIN'; // presupunând că ai un câmp role
    });
  }

  navigateToLessons() {
    this.router.navigate(['/lectii']);
  }

  navigateToTests() {
    this.router.navigate(['/test-general']);
  }

  navigateToUserStats() {
    this.router.navigate(['/admin/users']);
  }

  navigateToForum() {
    this.router.navigate(['/forum']);
  }
}
