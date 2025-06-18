import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LectiiService } from '../../../services/lectii.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-stats',
  standalone: false,
  templateUrl: './admin-user-stats.component.html',
  styleUrl: './admin-user-stats.component.scss',
})
export class AdminUserStatsComponent implements OnInit {
  utilizatori: any[] = [];
  progres: {
    [userId: string]: {
      lessonId: string;
      score: number;
      completedAt: string;
    }[];
  } = {};
  loading = true;
  expandedUserId: string | null = null;
  lessonTitles: { [id: string]: string } = {};

  constructor(
    private userService: UserService,
    private lectiiService: LectiiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.utilizatori = users;

      const cereriProgres = users.map((user: any) =>
        this.lectiiService.getLatestProgress(user.id)
      );

      forkJoin(cereriProgres).subscribe((toateProgresele) => {
        toateProgresele.forEach((progresUser, index) => {
          const userId = users[index].id;
          this.progres[userId] = progresUser;
        });

        this.lectiiService.getLectii().subscribe((lectii) => {
          lectii.forEach((lectie) => {
            this.lessonTitles[lectie.id] = lectie.title;
          });
          this.loading = false;
        });
      });
    });
  }

  toggleUser(userId: string): void {
    this.expandedUserId = this.expandedUserId === userId ? null : userId;
  }

  goToDetails(userId: string): void {
    this.router.navigate(['/admin/user', userId]);
  }
}
