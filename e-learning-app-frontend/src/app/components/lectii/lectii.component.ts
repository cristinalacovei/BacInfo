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

  constructor(
    private lectiiService: LectiiService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  private incarcaLectiile(): void {
    this.ani.forEach((an) => {
      this.lectiiService.getLectiiByClass(an.nivel).subscribe((data) => {
        this.lectiiPerAn[an.nume] = data;
      });
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.isAdmin = user?.userRole === 'ADMIN' || false; // 🔥 Evită crash-ul cu `?.`
        this.incarcaLectiile();
      },
      (error) => {
        console.error('Eroare la obținerea userului:', error);
        this.isAdmin = false; // Dacă apare o eroare, nu crăpăm
        this.incarcaLectiile();
      }
    );
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
