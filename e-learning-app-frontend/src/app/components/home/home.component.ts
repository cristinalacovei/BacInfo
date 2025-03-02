import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToLessons() {
    this.router.navigate(['/lectii']);
  }

  navigateToTests() {
    this.router.navigate(['/teste']);
  }
}
