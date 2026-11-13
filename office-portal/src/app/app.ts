import { Component } from '@angular/core';
import { EmployeeCrud } from './employee-crud/employee-crud';

@Component({
  selector: 'app-root',
  imports: [EmployeeCrud],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
