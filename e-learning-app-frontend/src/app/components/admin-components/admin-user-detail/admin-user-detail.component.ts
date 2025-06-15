import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { LectiiService } from '../../../services/lectii.service';

@Component({
  selector: 'app-admin-user-detail',
  standalone: false,
  templateUrl: './admin-user-detail.component.html',
  styleUrl: './admin-user-detail.component.scss',
})
export class AdminUserDetailComponent implements OnInit {
  userId!: string;
  userData: any;
  progress: any[] = [];
  lessonTitles: { [id: string]: string } = {};
  scoreThreshold = 0; // pentru slider
  sortBy: 'score' | 'title' = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private lectiiService: LectiiService
  ) {}

  get filteredAndSortedProgress() {
    return this.progress
      .filter((p) => p.score >= this.scoreThreshold)
      .sort((a, b) => {
        if (this.sortBy === 'score') {
          return this.sortOrder === 'asc'
            ? a.score - b.score
            : b.score - a.score;
        } else {
          const titleA = this.lessonTitles[a.lessonId] || '';
          const titleB = this.lessonTitles[b.lessonId] || '';
          return this.sortOrder === 'asc'
            ? titleA.localeCompare(titleB)
            : titleB.localeCompare(titleA);
        }
      });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;

    this.userService.getUserById(this.userId).subscribe((data) => {
      this.userData = data;
    });

    this.lectiiService.getLatestProgress(this.userId).subscribe((data) => {
      this.progress = data;

      // ⚠️ După ce avem progresul, luăm toate lecțiile pentru a extrage titlurile
      this.lectiiService.getLectii().subscribe((lectii) => {
        lectii.forEach((lectie) => {
          this.lessonTitles[lectie.id] = lectie.title;
        });
      });
    });
  }
}
