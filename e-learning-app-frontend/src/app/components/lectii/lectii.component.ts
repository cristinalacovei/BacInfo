import { Component, OnInit } from '@angular/core';
import { LectiiService } from '../../services/lectii.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatCard } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

interface Lesson {
  id: string;
  title: string;
  description: string;
  classLevel: number;
}

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
          const prefixA = this.romanToNumber(a.title);
          const prefixB = this.romanToNumber(b.title);
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

  private romanToNumber(roman: string): number {
    const map: { [key: string]: number } = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
      VI: 6,
      VII: 7,
      VIII: 8,
      IX: 9,
      X: 10,
    };
    const match = roman.trim().match(/^[IVXLCDM]+/);
    return match ? map[match[0]] || 999 : 999;
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
}
