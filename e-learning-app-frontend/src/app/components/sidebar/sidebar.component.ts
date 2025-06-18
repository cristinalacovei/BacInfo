import { Component, OnInit } from '@angular/core';
import { LectiiService } from '../../services/lectii.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  grupatePeClase: { [clasa: string]: any[] } = {};
  progressMap: { [lessonId: string]: number } = {};
  claseDeschise: { [clasa: string]: boolean } = {};

  constructor(
    private lectiiService: LectiiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.lectiiService.getLectii().subscribe((data) => {
      const sortate = data.sort((a, b) =>
        a.title.localeCompare(b.title, 'ro', { numeric: true })
      );

      this.grupatePeClase = sortate.reduce((acc, lectie) => {
        const cheie = `Clasa a ${lectie.classLevel}-a`;
        if (!acc[cheie]) acc[cheie] = [];
        acc[cheie].push(lectie);
        return acc;
      }, {} as { [clasa: string]: any[] });

      this.authService.getCurrentUser().subscribe((user) => {
        const userId = user.id;
        if (userId) {
          this.lectiiService.getLatestProgress(userId).subscribe((progres) => {
            progres.forEach((p) => {
              this.progressMap[p.lessonId] = p.score;
            });
          });
        }
      });
    });
  }
  toggleClasa(clasa: string) {
    this.claseDeschise[clasa] = !this.claseDeschise[clasa];
  }

  sortByClassLevel = (a: { key: string }, b: { key: string }): number => {
    const extrageNumar = (cheie: string) => {
      const match = cheie.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    return extrageNumar(a.key) - extrageNumar(b.key);
  };
}
