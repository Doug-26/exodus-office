import { Route, Routes } from '@angular/router';
import { WorkspaceShell } from './core/layout/workspace-shell/workspace-shell';

/** A navigation entry whose feature has not been built yet. Shows a placeholder page with the planned phase. */
function plannedArea(path: string, heading: string, phase: string, description: string): Route {
  return {
    path,
    title: heading,
    loadComponent: () =>
      import('./core/layout/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage),
    data: { heading, phase, description },
  };
}

export const routes: Routes = [
  {
    path: '',
    component: WorkspaceShell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'employees' },
      {
        path: 'employees',
        title: 'Employees',
        loadComponent: () =>
          import('./features/employees/employees-page/employees-page').then((m) => m.EmployeesPage),
      },
      plannedArea(
        'overview',
        'Overview',
        'Phase 5',
        'Summary cards and headcount trends for the whole office.',
      ),
      plannedArea(
        'departments',
        'Departments',
        'Phase 4',
        'Manage departments and assign employees to them.',
      ),
      plannedArea(
        'attendance',
        'Attendance',
        'Phase 6',
        'Daily check-ins, corrections, and monthly attendance views.',
      ),
      plannedArea(
        'reports',
        'Reports',
        'Phase 5',
        'Headcount by department, hires by month, and exports.',
      ),
      plannedArea(
        'settings',
        'Settings',
        'Phase 7',
        'Profile, password, and workspace preferences.',
      ),
      plannedArea('help', 'Help center', 'Phase 7', 'Guides and tips for using the workspace.'),
    ],
  },
  { path: '**', redirectTo: 'employees' },
];
