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
        'BacInfoLearn este platforma ideală pentru pregătirea examenului de Bacalaureat la informatică, oferind lecții, teste interactive și exemple practice.',
      isOpen: false,
    },
    {
      question: 'Cum funcționează platforma?',
      answer:
        'Accesezi lecții organizate pe capitole, rezolvi teste, analizezi răspunsurile greșite și îți urmărești progresul în timp real.',
      isOpen: false,
    },
    {
      question: 'Cum îmi pot urmări progresul?',
      answer: 'Fiecare test completat actualizează automat progresul tău.',
      isOpen: false,
    },
    {
      question: 'Pot să refac testele sau să exersez întrebările greșite?',
      answer:
        'Da! Poți reface testele oricând dorești și poți exersa întrebările pe care le-ai greșit anterior.',
      isOpen: false,
    },
    {
      question: 'Ce este forumul BacInfoLearn?',
      answer:
        'Forumul este locul unde poți pune întrebări, răspunde altor colegi și discuta concepte de informatică pentru Bacalaureat.',
      isOpen: false,
    },
    {
      question: 'Ce opțiuni au profesorii pe platformă?',
      answer:
        'Profesorii pot exporta rapid în format PDF pentru a fi utilizate la clasă sau ca teme.',
      isOpen: false,
    },
  ];

  // Funcție pentru a alterna afișarea răspunsurilor
  toggleAnswer(index: number) {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
}
