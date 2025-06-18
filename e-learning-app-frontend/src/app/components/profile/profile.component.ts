import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user.types';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isEditing: boolean = false;
  usernameTaken: boolean = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' = 'success';
  imageChangedEvent: any = '';
  croppedImage: any = '';

  onFileChange(event: any): void {
    this.imageChangedEvent = event;
  }

  onImageCropped(event: ImageCroppedEvent): void {
    console.log('🧨 Imagine decupată:', event);
    this.croppedImage = event.base64;
  }

  selectCroppedAvatar(): void {
    if (this.user && this.croppedImage) {
      this.user.profileImageUrl = this.croppedImage;
      this.imageChangedEvent = null;
      this.croppedImage = null;
      this.showMessage('Avatar actualizat! Salvează profilul.', 'success');
    }
  }

  showMessage(message: string, type: 'success' | 'error' = 'success') {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => {
      this.feedbackMessage = null;
    }, 3000);
  }

  editProfile() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const username = this.authService.getUsername();

    if (username) {
      this.userService.getUserByUsername(username).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          console.error('Eroare la încărcarea utilizatorului:', err);
        },
      });
    }
  }
  avatars: string[] = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png',
    '/avatars/avatar4.png',
    '/avatars/avatar5.png',
    '/avatars/avatar6.png',
    '/avatars/avatar7.png',
    '/avatars/avatar8.png',
  ];

  saveProfile() {
    if (this.user) {
      if (this.croppedImage) {
        this.user.profileImageUrl = this.croppedImage;
      }

      this.userService.updateUser(this.user).subscribe({
        next: () => {
          this.isEditing = false;
          this.showMessage('Profilul a fost salvat!', 'success');

          this.croppedImage = null;
          this.imageChangedEvent = null;
        },
        error: (err) => {
          this.showMessage('Eroare la salvarea profilului.', 'error');
          console.error('Eroare la salvare', err);
        },
      });
    }
  }

  checkUsernameAvailability(): void {
    if (this.user?.username) {
      this.authService.checkUsername(this.user.username).subscribe({
        next: (available) => {
          this.usernameTaken = !available;
          if (!available) {
            this.showMessage('Username-ul este deja folosit.', 'error');
          }
        },
        error: (err) => {
          this.showMessage('Eroare la verificarea username-ului.', 'error');
          console.error('Eroare la verificarea username-ului', err);
        },
      });
    }
  }

  selectAvatar(avatarUrl: string): void {
    if (this.user) {
      this.user.profileImageUrl = avatarUrl;
    }
  }
}
