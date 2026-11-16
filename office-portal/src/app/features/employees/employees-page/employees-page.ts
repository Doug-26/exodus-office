import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError } from '../../../core/http/api-error';
import { NotificationService } from '../../../shared/feedback/notification.service';
import { EmployeeApiService } from '../employee-api.service';
import { Employee, EmployeeInput, emptyEmployeeInput, initialsOf } from '../employee.model';

/** Employee directory: list, create, edit, and delete. Search, filters, and paging arrive in Phase 3. */
@Component({
  selector: 'app-employees-page',
  imports: [FormsModule],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.css',
})
export class EmployeesPage implements OnInit {
  private readonly api = inject(EmployeeApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly isEditorOpen = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly openMenuEmployeeId = signal<number | null>(null);

  protected readonly isEditMode = computed(() => this.editingId() !== null);
  protected readonly recordCount = computed(() => this.employees().length);

  /** Editor fields bound with ngModel. Phase 1 replaces this with Signal Forms and field-level validation. */
  protected draft: EmployeeInput = emptyEmployeeInput();

  protected readonly initialsOf = initialsOf;

  ngOnInit(): void {
    this.loadEmployees();
  }

  protected loadEmployees(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.api.getAll().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.loadError.set(ApiError.from(error).message);
        this.isLoading.set(false);
      },
    });
  }

  protected openCreateEditor(): void {
    this.draft = emptyEmployeeInput();
    this.editingId.set(null);
    this.openMenuEmployeeId.set(null);
    this.isEditorOpen.set(true);
  }

  protected openEditEditor(employee: Employee): void {
    const { id, ...fields } = employee;
    this.draft = { ...fields };
    this.editingId.set(id);
    this.openMenuEmployeeId.set(null);
    this.isEditorOpen.set(true);
  }

  protected closeEditor(): void {
    if (this.isSaving()) {
      return;
    }
    this.isEditorOpen.set(false);
    this.editingId.set(null);
  }

  protected toggleActionsMenu(employeeId: number): void {
    this.openMenuEmployeeId.update((openId) => (openId === employeeId ? null : employeeId));
  }

  protected submitEditor(): void {
    const editingId = this.editingId();
    const request =
      editingId === null ? this.api.create(this.draft) : this.api.update(editingId, this.draft);
    const successMessage = editingId === null ? 'Employee created.' : 'Employee updated.';

    this.isSaving.set(true);
    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.notifications.success(successMessage);
        this.closeEditor();
        this.loadEmployees();
      },
      error: (error: unknown) => {
        this.isSaving.set(false);
        this.notifications.error(ApiError.from(error).messages.join(' '));
      },
    });
  }

  protected deleteEmployee(employee: Employee): void {
    this.openMenuEmployeeId.set(null);
    if (!confirm(`Delete ${employee.name}? This cannot be undone.`)) {
      return;
    }

    this.api.delete(employee.id).subscribe({
      next: () => {
        this.notifications.success('Employee deleted.');
        this.loadEmployees();
      },
      error: (error: unknown) => {
        this.notifications.error(ApiError.from(error).message);
      },
    });
  }
}
