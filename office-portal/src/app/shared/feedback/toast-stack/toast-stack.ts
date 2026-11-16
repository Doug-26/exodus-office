import { Component, inject } from '@angular/core';
import { NotificationService } from '../notification.service';

/** Renders queued notifications in the bottom-right corner. Errors use role="alert"; successes use role="status". */
@Component({
  selector: 'app-toast-stack',
  template: `
    <div class="toast-stack">
      @for (toast of notifications.toasts(); track toast.id) {
        <div
          class="toast-item"
          [class.toast-success]="toast.kind === 'success'"
          [class.toast-error]="toast.kind === 'error'"
          [attr.role]="toast.kind === 'error' ? 'alert' : 'status'"
        >
          <span class="toast-message">{{ toast.message }}</span>
          <button
            class="toast-dismiss"
            type="button"
            aria-label="Dismiss notification"
            (click)="notifications.dismiss(toast.id)"
          >
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toast-stack {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 1100;
      display: grid;
      gap: 8px;
      max-width: min(360px, calc(100vw - 32px));
    }
    .toast-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 11px 12px 11px 14px;
      border: 1px solid;
      border-radius: 9px;
      background: #fff;
      box-shadow: 0 10px 30px rgb(35 38 58 / 14%);
      font-size: 11px;
      line-height: 1.45;
    }
    .toast-success {
      border-color: #cdeedd;
      color: #2c7a57;
    }
    .toast-error {
      border-color: #f3cfd3;
      color: #a73a46;
    }
    .toast-message {
      flex: 1 1 auto;
    }
    .toast-dismiss {
      flex: 0 0 auto;
      margin: -4px -4px 0 0;
      padding: 0 5px;
      border: 0;
      border-radius: 5px;
      background: transparent;
      color: inherit;
      font-size: 16px;
      line-height: 1;
    }
    .toast-dismiss:hover {
      background: rgb(0 0 0 / 6%);
    }
    .toast-dismiss:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 1px;
    }
  `,
})
export class ToastStack {
  protected readonly notifications = inject(NotificationService);
}
