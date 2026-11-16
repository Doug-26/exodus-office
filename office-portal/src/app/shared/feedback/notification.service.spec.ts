import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = TestBed.inject(NotificationService);
  });

  it('queues success and error toasts in order', () => {
    service.success('Saved.');
    service.error('Failed.');

    expect(service.toasts().map((t) => [t.kind, t.message])).toEqual([
      ['success', 'Saved.'],
      ['error', 'Failed.'],
    ]);
  });

  it('removes a toast when dismissed', () => {
    service.success('One');
    service.success('Two');
    const [first] = service.toasts();

    service.dismiss(first.id);

    expect(service.toasts().map((t) => t.message)).toEqual(['Two']);
  });
});
