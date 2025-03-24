import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user.types';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const username = this.authService.getUsername();

    if (username) {
      this.userService.getUserByUsername(username).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          console.error('Eroare la încărcarea utilizatorului:', err);
        },
      });
    }
  }
}
