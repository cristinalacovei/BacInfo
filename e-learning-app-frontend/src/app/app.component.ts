import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { User } from './types/user.types';
import { NotificareService } from './services/notificare.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'elearning';
  currentYear: number = new Date().getFullYear();
  isLoggedIn = false;
  isAdmin = false;
  isSidebarOpen = false;
  user: User | null = null;
  notificari: any[] = [];
  notificariNecitite: any[] = [];
  notificariDeschise = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private notificareService: NotificareService
  ) {}

  ngOnInit(): void {
    this.authService.getIsLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

      if (!loggedIn) return;

      // Așteaptă cu adevărat userul
      this.authService.getCurrentUser().subscribe((user) => {
        if (!user) return;

        this.user = user;
        this.isAdmin = user.userRole === 'ADMIN';

        // 🔁 Întotdeauna preia din backend, nu te baza doar pe websocket
        this.loadNotificari(user.id);

        // 🧲 Ascultă notificări live DOAR DUPĂ ce ai user.id
        this.notificareService.subscribeToWebSocket((nouaNotif) => {
          if (!nouaNotif.userId || nouaNotif.userId === this.user?.id) {
            this.notificari.unshift(nouaNotif);
            this.notificariNecitite.unshift(nouaNotif);
          }
        });
      });
    });
  }

  private loadNotificari(userId: string) {
    this.notificareService.getNotificari(userId).subscribe((data) => {
      console.log('📥 Notificări primite:', data); // debug
      this.notificari = data.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      this.notificariNecitite = this.notificari.filter((n) => !n.citita);
    });
  }

  marcheazaCaCitita(id: string) {
    this.notificareService.markAsRead(id).subscribe(() => {
      const notif = this.notificari.find((n) => n.id === id);
      if (notif) notif.citita = true;
      this.notificariNecitite = this.notificari.filter((n) => !n.citita);
    });
  }

  marcheazaToateCaCitite() {
    if (!this.user) return;
    this.notificareService.markAllAsRead(this.user.id).subscribe(() => {
      this.notificari.forEach((n) => (n.citita = true));
      this.notificariNecitite = [];
    });
  }

  toggleNotificari() {
    this.notificariDeschise = !this.notificariDeschise;

    if (this.notificariDeschise && this.user) {
      this.marcheazaToateCaCitite();
    }
  }

  navigateFromNotification(notif: any): void {
    if (!notif.citita) this.marcheazaCaCitita(notif.id);

    this.notificariDeschise = false; // Închide dropdown-ul

    const targetId = notif.targetId;
    const tip = notif.tip?.toUpperCase();

    if (tip === 'LECTIE' && targetId) {
      this.router.navigate(['/lectie', targetId]);
    } else if (tip === 'TEST' && targetId) {
      this.router.navigate(['/test', targetId]);
    } else if (tip === 'FORUM' && targetId) {
      this.router.navigate(['/forum', targetId]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']).catch((err) => {
      console.error('Failed to navigate to login page:', err);
    });
  }

  navigateToProfile(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/profile']).catch((err) => {
        console.error('Failed to navigate to profile page:', err);
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          title: 'Login Required',
          message: 'You need to log in to access your profile.',
          singleButton: true,
        },
      });
    }
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']).catch((err) => {
      console.error('Failed to navigate to contact page:', err);
    });
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        singleButton: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
        this.user = null;
        this.isAdmin = false;
        this.isLoggedIn = false;
        this.notificari = [];
        this.notificariNecitite = [];
        this.notificariDeschise = false;
        this.router.navigate(['']);
      }
    });
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/default-avatar.png'; // fallback default
  }
}
