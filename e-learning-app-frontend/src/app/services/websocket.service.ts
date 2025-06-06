import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client!: Client;

  connect(topic: string): Observable<any> {
    const subject = new Subject<any>();
    const socket = new SockJS(`${environment.apiUrl}/ws`);

    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {},
    });

    this.client.onConnect = () => {
      this.client.subscribe(topic, (message: IMessage) => {
        subject.next(JSON.parse(message.body));
      });
    };

    this.client.activate();
    return subject.asObservable();
  }
}
