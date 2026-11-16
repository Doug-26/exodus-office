import { Service, signal } from '@angular/core';

export type ToastKind = 'success' | 'error';

export interface Toast {
  readonly id: number;
  readonly kind: ToastKind;
  readonly message: string;
}

const SUCCESS_TTL_MS = 4000;
const ERROR_TTL_MS = 8000;

/** App-wide feedback queue rendered by `ToastStack`. Replaces `alert()` for request outcomes. */
@Service()
export class NotificationService {
  private readonly queue = signal<readonly Toast[]>([]);
  private nextId = 1;

  readonly toasts = this.queue.asReadonly();

  success(message: string): void {
    this.push('success', message, SUCCESS_TTL_MS);
  }

  error(message: string): void {
    this.push('error', message, ERROR_TTL_MS);
  }

  dismiss(id: number): void {
    this.queue.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private push(kind: ToastKind, message: string, ttlMs: number): void {
    const id = this.nextId++;
    this.queue.update((toasts) => [...toasts, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), ttlMs);
  }
}
