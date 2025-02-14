import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
  // Array pentru întrebări și starea răspunsului
  faqItems = [
    {
      question: 'Ce este BacInfoLearn?',
      answer:
        'BacInfoLearn este platforma ideală pentru cei care se pregătesc pentru examenul de Bacalaureat la informatică. Oferim lecții structurate, exemple practice și teste interactive pentru fiecare capitol important.',
      isOpen: false,
    },
    {
      question: 'Cum funcționează platforma?',
      answer:
        'Platforma îți permite să accesezi lecții online, să rezolvi teste și să îți urmărești progresul în timp real, pentru a te pregăti eficient pentru examenul de Bacalaureat.',
      isOpen: false,
    },
  ];

  // Funcție pentru a alterna afișarea răspunsurilor
  toggleAnswer(index: number) {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
}
