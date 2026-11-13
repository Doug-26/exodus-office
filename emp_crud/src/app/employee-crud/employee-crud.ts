import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Employee {
  empId: number;
  empName: string;
  empMobile: string;
  empEmail: string;
  city: string;
  region: string;
  address: string;
}

@Component({
  imports: [FormsModule],
  selector: 'app-employee-crud',
  styleUrl: './employee-crud.css',
  templateUrl: './employee-crud.html',
})
export class EmployeeCrud implements OnInit {

  http = inject(HttpClient);
  employeeList = signal<Employee[]>([]); 
  isCreateModalOpen = signal(false);
  isEditMode = signal(false);
  openMenuEmployeeId = signal<number | null>(null);

  employeeObj: Employee = {
    "empId": 0,
    "empName": "",
    "empMobile": "",
    "empEmail": "",
    "city": "",
    "region": "",
    "address": ""
  }

  ngOnInit(): void {
    this.getAllEmployee();
  }

  openCreateModal() {
    this.employeeObj = {
      empId: 0,
      empName: '',
      empMobile: '',
      empEmail: '',
      city: '',
      region: '',
      address: '',
    };
    this.isEditMode.set(false);
    this.openMenuEmployeeId.set(null);
    this.isCreateModalOpen.set(true);
  }

  openEditModal(employee: Employee) {
    this.employeeObj = { ...employee };
    this.isEditMode.set(true);
    this.openMenuEmployeeId.set(null);
    this.isCreateModalOpen.set(true);
  }

  toggleActionsMenu(employeeId: number) {
    this.openMenuEmployeeId.update((openId) => openId === employeeId ? null : employeeId);
  }

  onSubmitEmployee() {
    if (this.isEditMode()) {
      this.onUpdateEmployee();
      return;
    }
    this.onSaveEmployee();
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
    this.isEditMode.set(false);
  }

  getAllEmployee() {
    this.http.get<Employee[]>("https://localhost:7269/api/Employee/GetEmployee").subscribe({
      next:(res:Employee[]) => {
        this.employeeList.set(res);
      }
    })
  }

  onSaveEmployee() {
    const employeeToCreate: Omit<Employee, 'empId'> = {
      empName: this.employeeObj.empName,
      empMobile: this.employeeObj.empMobile,
      empEmail: this.employeeObj.empEmail,
      city: this.employeeObj.city,
      region: this.employeeObj.region,
      address: this.employeeObj.address,
    };

    this.http.post<Employee>("https://localhost:7269/api/Employee/CreateNewEmployee", employeeToCreate).subscribe({
      next:(res:Employee) => {
        alert("Employee Created");
        this.closeCreateModal();
        this.getAllEmployee();
      }
    })
  }

  onUpdateEmployee() {
    this.http.put<Employee>(`https://localhost:7269/api/Employee/UpdateEmployee?id=${this.employeeObj.empId}`, this.employeeObj).subscribe({
      next:(res:Employee) => {
        alert("Employee Updated");
        this.closeCreateModal();
        this.getAllEmployee();
      }
    })
  }

  onDeleteEmployee(id: number) {
    this.openMenuEmployeeId.set(null);
    if (!confirm('Delete this employee?')) return;

    this.http.delete<Employee>(`https://localhost:7269/api/Employee/DeleteEmployee?id=${id}`).subscribe({
      next:(res:Employee) => {
        alert("Employee Deleted");
        this.getAllEmployee();
      }
    })
  }

}
