import { Component, OnInit } from '@angular/core';
import { LectiiService } from '../../services/lectii.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatCard } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { Lesson } from '../../types/lesson.types';
@Component({
  selector: 'app-lectii',
  standalone: false,
  templateUrl: './lectii.component.html',
  styleUrl: './lectii.component.scss',
})
export class LectiiComponent implements OnInit {
  ani = [
    { nume: 'Clasa a 9-a', nivel: 9 },
    { nume: 'Clasa a 10-a', nivel: 10 },
    { nume: 'Clasa a 11-a', nivel: 11 },
    { nume: 'Clasa a 12-a', nivel: 12 },
  ];
  lectiiPerAn: { [key: string]: Lesson[] } = {};
  anSelectat: number | null = null;
  isAdmin: boolean = false;
  progressMap = new Map<string, { score: number; completedAt: string }>();
  userId: string | null = null;

  constructor(
    private lectiiService: LectiiService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  private incarcaLectiile(): void {
    this.ani.forEach((an) => {
      this.lectiiService.getLectiiByClass(an.nivel).subscribe((data) => {
        const sorted = data.sort((a, b) => {
          const prefixA = this.extrageNumarDinTitlu(a.title);
          const prefixB = this.extrageNumarDinTitlu(b.title);
          return prefixA - prefixB;
        });
        this.lectiiPerAn[an.nume] = sorted;
      });
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.isAdmin = user?.userRole === 'ADMIN' || false;
        this.userId = user?.id;
        this.incarcaLectiile();

        if (this.userId) {
          this.lectiiService
            .getLatestProgress(this.userId)
            .subscribe((progresses) => {
              for (const p of progresses) {
                this.progressMap.set(p.lessonId, {
                  score: p.score,
                  completedAt: p.completedAt,
                });
              }
            });
        }
      },
      (error) => {
        console.error('Eroare la obținerea userului:', error);
        this.isAdmin = false;
        this.incarcaLectiile();
      }
    );
  }

  private extrageNumarDinTitlu(titlu: string): number {
    const match = titlu.trim().match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 9999;
  }

  selecteazaAn(nivel: number) {
    this.anSelectat = this.anSelectat === nivel ? null : nivel;
  }

  stergeLectie(id: string, anNume: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmare ștergere',
        message: 'Ești sigur că vrei să ștergi această lecție?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.lectiiService.stergeLectie(id).subscribe(() => {
          this.lectiiPerAn[anNume] = this.lectiiPerAn[anNume].filter(
            (lectie) => lectie.id !== id
          );
        });
      }
    });
  }

  adaugaLectie() {
    this.router.navigate(['/editor']);
  }

  getProgresTotal(): number {
    let total = 0;
    let completate = 0;

    for (const lectii of Object.values(this.lectiiPerAn)) {
      for (const lectie of lectii) {
        total++;
        const progress = this.progressMap.get(lectie.id!);
        if (progress && progress.score !== null) {
          completate++;
        }
      }
    }

    return total > 0 ? Math.round((completate / total) * 100) : 0;
  }

  getLectiiCompletate(): string {
    let total = 0;
    let completate = 0;

    for (const lectii of Object.values(this.lectiiPerAn)) {
      for (const lectie of lectii) {
        total++;
        const progress = this.progressMap.get(lectie.id!);
        if (progress && progress.score !== null) {
          completate++;
        }
      }
    }

    return `${completate} din ${total}`;
  }
}
