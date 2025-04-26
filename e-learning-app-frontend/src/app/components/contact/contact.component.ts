import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  showConfirmation = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  submitContactForm(): void {
    if (this.contactForm.valid) {
      this.showConfirmation = true; // 🔥 Afișăm mesajul

      setTimeout(() => {
        const subject = encodeURIComponent(this.contactForm.value.subject);
        const body = encodeURIComponent(this.contactForm.value.message);
        const siteEmail = 'infobaclearn@gmail.com';

        const mailtoLink = `mailto:${siteEmail}?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        this.showConfirmation = false; // 🔥 Ascundem după deschiderea emailului
      }, 1500); // Delay de 1.5 secunde pentru a arăta mesajul
    }
  }
}
