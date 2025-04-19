import { Component, OnInit } from '@angular/core';
import { LectiiService } from '../services/lectii.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  grupatePeClase: { [clasa: string]: any[] } = {};

  constructor(private lectiiService: LectiiService) {}

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
    });
  }
}
