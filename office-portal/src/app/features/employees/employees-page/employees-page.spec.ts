import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../../core/config/api.config';
import { apiErrorInterceptor } from '../../../core/http/api-error.interceptor';
import { NotificationService } from '../../../shared/feedback/notification.service';
import { Employee } from '../employee.model';
import { EmployeesPage } from './employees-page';

const EMPLOYEES_URL = 'http://test/api/v1/employees';

const sampleEmployees: Employee[] = [
  {
    id: 1,
    name: 'Maria Santos',
    mobile: '+639171234567',
    email: 'maria@example.com',
    city: 'Naga',
    region: 'Bicol',
    address: 'Concepcion Pequeña',
  },
  {
    id: 2,
    name: 'Miguel Reyes',
    mobile: '+639057721408',
    email: 'miguel@example.com',
    city: 'Iriga',
    region: 'Bicol',
    address: 'San Roque',
  },
];

describe('EmployeesPage', () => {
  let fixture: ComponentFixture<EmployeesPage>;
  let http: HttpTestingController;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesPage],
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://test/api/v1' },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EmployeesPage);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('shows a loading state until the directory arrives', () => {
    expect(element.querySelector('.table-state')?.textContent).toContain('Loading employees');
    http.expectOne({ method: 'GET', url: EMPLOYEES_URL }).flush([]);
  });

  it('renders one row per employee with data-derived initials and count', async () => {
    http.expectOne({ method: 'GET', url: EMPLOYEES_URL }).flush(sampleEmployees);
    await fixture.whenStable();

    const rows = element.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.employee-avatar')?.textContent?.trim()).toBe('MS');
    expect(rows[0].querySelector('.contact-cell small')?.textContent?.trim()).toBe('+639171234567');
    expect(element.querySelector('.record-count')?.textContent?.trim()).toBe('2');
  });

  it('shows an empty state when there are no employees', async () => {
    http.expectOne({ method: 'GET', url: EMPLOYEES_URL }).flush([]);
    await fixture.whenStable();

    expect(element.querySelector('.table-state')?.textContent).toContain('No employees yet');
  });

  it('shows the API error and a retry button when loading fails', async () => {
    http
      .expectOne({ method: 'GET', url: EMPLOYEES_URL })
      .flush(
        { title: 'Server exploded', status: 500 },
        { status: 500, statusText: 'Internal Server Error' },
      );
    await fixture.whenStable();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Server exploded');

    (element.querySelector('.retry-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    http.expectOne({ method: 'GET', url: EMPLOYEES_URL }).flush(sampleEmployees);
    await fixture.whenStable();

    expect(element.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('posts a new employee, reports success, and reloads the list', async () => {
    http.expectOne({ method: 'GET', url: EMPLOYEES_URL }).flush([]);
    await fixture.whenStable();
    const notifications = TestBed.inject(NotificationService);

    (element.querySelector('.add-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(element.querySelector('#employee-editor-title')?.textContent).toContain(
      'Create employee',
    );

    const form = element.querySelector('form.employee-form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    const create = http.expectOne({ method: 'POST', url: EMPLOYEES_URL });
    create.flush({ ...sampleEmployees[0] }, { status: 201, statusText: 'Created' });
    await fixture.whenStable();

    expect(notifications.toasts().map((t) => t.kind)).toEqual(['success']);
    expect(element.querySelector('#employee-editor-title')).toBeNull();
    http.expectOne({ method: 'GET', url: EMPLOYEES_URL }).flush(sampleEmployees);
  });

  it('surfaces validation messages from the API when saving fails', async () => {
    http.expectOne({ method: 'GET', url: EMPLOYEES_URL }).flush([]);
    await fixture.whenStable();
    const notifications = TestBed.inject(NotificationService);

    (element.querySelector('.add-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    (element.querySelector('form.employee-form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );
    await fixture.whenStable();

    http.expectOne({ method: 'POST', url: EMPLOYEES_URL }).flush(
      {
        title: 'One or more validation errors occurred.',
        status: 400,
        errors: { Mobile: ['Mobile must start with +63 followed by 10 digits beginning with 9.'] },
      },
      { status: 400, statusText: 'Bad Request' },
    );
    await fixture.whenStable();

    expect(notifications.toasts()[0].kind).toBe('error');
    expect(notifications.toasts()[0].message).toContain('Mobile must start with +63');
    expect(element.querySelector('#employee-editor-title')).not.toBeNull();
  });
});
