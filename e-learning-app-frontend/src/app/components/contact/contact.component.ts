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
  isSubmitting = false;
  showConfirmation = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  submitContactForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showConfirmation = true;

    setTimeout(() => {
      const { subject, message } = this.contactForm.value;
      const mailto = `mailto:infobaclearn@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message)}`;
      window.location.href = mailto;

      this.isSubmitting = false;
      this.showConfirmation = false;
    }, 1500);
  }
}
