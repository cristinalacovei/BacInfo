import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from './websocket.service';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificareService {
  constructor(private http: HttpClient, private ws: WebSocketService) {}

  getNotificari(userId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/api/notificari/toate/${userId}`
    );
  }

  getNotificariNecitite(userId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/api/notificari/necitite/${userId}`
    );
  }

  markAsRead(id: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/api/notificari/citita/${id}`,
      {}
    );
  }

  markAllAsRead(userId: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/api/notificari/citeste-tot/${userId}`,
      {}
    );
  }

  subscribeToWebSocket(callback: (notif: any) => void) {
    this.ws.connect('/topic/notificari').subscribe(callback);
  }
}
