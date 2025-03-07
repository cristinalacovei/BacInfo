import { Component, OnInit } from '@angular/core';
import { LectiiService } from '../../services/lectii.service';

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

  constructor(private lectiiService: LectiiService) {}

  ngOnInit(): void {
    this.ani.forEach((an) => {
      this.lectiiService.getLectiiByClass(an.nivel).subscribe((data) => {
        this.lectiiPerAn[an.nume] = data;
      });
    });
  }

  selecteazaAn(nivel: number) {
    this.anSelectat = this.anSelectat === nivel ? null : nivel;
  }
}
