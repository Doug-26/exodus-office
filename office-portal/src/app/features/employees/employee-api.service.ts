import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { Employee, EmployeeInput } from './employee.model';

/** Typed access to the employee endpoints. Errors arrive as `ApiError` via the HTTP interceptor. */
@Service()
export class EmployeeApiService {
  private readonly http = inject(HttpClient);
  private readonly employeesUrl = `${inject(API_BASE_URL)}/employees`;

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl);
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeesUrl}/${id}`);
  }

  create(input: EmployeeInput): Observable<Employee> {
    return this.http.post<Employee>(this.employeesUrl, input);
  }

  update(id: number, input: EmployeeInput): Observable<Employee> {
    return this.http.put<Employee>(`${this.employeesUrl}/${id}`, input);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.employeesUrl}/${id}`);
  }
}
