import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'danger';

export interface ToastMessage {
  id?: number;
  severity: ToastSeverity;
  summary: string;
  detail?: string;
  duration?: number; // milisegundos, ej: 5000
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messagesSubject = new Subject<ToastMessage>();
  messages$ = this.messagesSubject.asObservable();

  private idCounter = 0;

  show(msg: ToastMessage) {
    msg.id = ++this.idCounter;
    this.messagesSubject.next(msg);
  }

  success(summary: string, detail?: string, duration?: number) {
    this.show({ severity: 'success', summary, detail, duration });
  }

  error(summary: string, detail?: string, duration?: number) {
    this.show({ severity: 'danger', summary, detail, duration });
  }

  warn(summary: string, detail?: string, duration?: number) {
    this.show({ severity: 'warn', summary, detail, duration });
  }

  info(summary: string, detail?: string, duration?: number) {
    this.show({ severity: 'info', summary, detail, duration });
  }
}
