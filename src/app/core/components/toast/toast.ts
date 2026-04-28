import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DEFAULT_TOAST_TIMER } from '@core/constants';
import { ToastMessage, ToastService } from '@core/services';

interface ToastTimer {
  timeout: ReturnType<typeof setTimeout>;
  start: number;
  duration: number;
}

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  private toastService = inject(ToastService);

  messages = signal<ToastMessage[]>([]);
  private timers = new Map<number, ToastTimer>();
  private pausedTimers = new Map<number, number>();

  constructor() {
    this.toastService.messages$.pipe(takeUntilDestroyed()).subscribe((msg) => {
      this.messages.update((list) => [...list, msg]);
      this.startTimer(msg.id!, msg.duration ?? DEFAULT_TOAST_TIMER);
    });
  }

  remove(id: number) {
    this.messages.update((list) => list.filter((m) => m.id !== id));
    clearTimeout(this.timers.get(id)?.timeout);
    this.timers.delete(id);
    this.pausedTimers.delete(id);
  }

  pauseTimer(id: number) {
    const timer = this.timers.get(id);
    if (!timer) return;
    const remaining = Math.max(timer.duration - (Date.now() - timer.start), 0);
    this.pausedTimers.set(id, remaining);
    clearTimeout(timer.timeout);
  }

  resumeTimer(id: number) {
    const remaining = this.pausedTimers.get(id);
    if (remaining == null) return;
    this.startTimer(id, remaining);
    this.pausedTimers.delete(id);
  }

  private startTimer(id: number, duration: number) {
    const timeout = setTimeout(() => this.remove(id), duration);
    this.timers.set(id, { timeout, start: Date.now(), duration });
  }

  severityClass(severity: string): string {
    return `toast toast-enter toast-${severity}`;
  }
}
