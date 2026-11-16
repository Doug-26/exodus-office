import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/config/api.config';
import { EmployeeApiService } from './employee-api.service';
import { EmployeeInput } from './employee.model';

describe('EmployeeApiService', () => {
  let service: EmployeeApiService;
  let http: HttpTestingController;

  const input: EmployeeInput = {
    name: 'Maria Santos',
    mobile: '+639171234567',
    email: 'maria@example.com',
    city: 'Naga',
    region: 'Bicol',
    address: 'Concepcion Pequeña',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://test/api/v1' },
      ],
    });
    service = TestBed.inject(EmployeeApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists employees from the versioned collection URL', () => {
    service.getAll().subscribe();
    http.expectOne({ method: 'GET', url: 'http://test/api/v1/employees' }).flush([]);
  });

  it('creates with POST to the collection', () => {
    service.create(input).subscribe();
    const request = http.expectOne({ method: 'POST', url: 'http://test/api/v1/employees' });
    expect(request.request.body).toEqual(input);
    request.flush({ id: 1, ...input });
  });

  it('updates with PUT to the item URL', () => {
    service.update(7, input).subscribe();
    const request = http.expectOne({ method: 'PUT', url: 'http://test/api/v1/employees/7' });
    expect(request.request.body).toEqual(input);
    request.flush({ id: 7, ...input });
  });

  it('deletes with DELETE to the item URL', () => {
    service.delete(7).subscribe();
    http
      .expectOne({ method: 'DELETE', url: 'http://test/api/v1/employees/7' })
      .flush(null, { status: 204, statusText: 'No Content' });
  });
});
