import { Component, inject, effect } from '@angular/core';
import { UiStore } from '@store/index';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  readonly uiStore = inject(UiStore);
  readonly messages = this.uiStore.activeToasts;

  private timers = new Map<number, ReturnType<typeof setTimeout>>();
  private pausedTimers = new Map<number, number>();
  private startTimes = new Map<number, number>();
  private durations = new Map<number, number>();

  constructor() {
    effect(() => {
      const current = this.messages().map((m) => m.id!);
      for (const msg of this.messages()) {
        if (!this.timers.has(msg.id!)) {
          this.startTimer(msg.id!, msg.duration ?? 4000);
        }
      }
      for (const [id] of this.timers) {
        if (!current.includes(id)) {
          clearTimeout(this.timers.get(id));
          this.timers.delete(id);
          this.startTimes.delete(id);
          this.durations.delete(id);
        }
      }
    });
  }

  remove(id: number) {
    this.uiStore.removeToast(id);
  }

  pauseTimer(id: number) {
    const start = this.startTimes.get(id);
    const duration = this.durations.get(id);
    if (start == null || duration == null) return;
    const remaining = Math.max(duration - (Date.now() - start), 0);
    this.pausedTimers.set(id, remaining);
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
  }

  resumeTimer(id: number) {
    const remaining = this.pausedTimers.get(id);
    if (remaining == null) return;
    this.pausedTimers.delete(id);
    this.startTimer(id, remaining);
  }

  private startTimer(id: number, duration: number) {
    this.startTimes.set(id, Date.now());
    this.durations.set(id, duration);
    const timeout = setTimeout(() => this.remove(id), duration);
    this.timers.set(id, timeout);
  }

  severityClass(severity: string): string {
    return `toast toast-enter toast-${severity}`;
  }
}
