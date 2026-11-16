import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '../../../app.routes';
import { API_BASE_URL } from '../../config/api.config';
import { WorkspaceShell } from './workspace-shell';

describe('WorkspaceShell', () => {
  let fixture: ComponentFixture<WorkspaceShell>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceShell],
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://test/api/v1' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceShell);
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('renders a link for every workspace area', () => {
    const links = Array.from(fixture.nativeElement.querySelectorAll('nav.nav a')) as HTMLElement[];
    const labels = links.map((link) => {
      const icon = link.querySelector('.nav-icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
      return (link.textContent ?? '').replace(icon?.textContent ?? '', '').trim();
    });
    expect(labels).toEqual(['Overview', 'Employees', 'Departments', 'Attendance', 'Reports']);
  });

  it('uses the Exodus Office name instead of the old PeopleHub placeholder', () => {
    const html = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(html).not.toContain('PeopleHub');
    expect(fixture.nativeElement.querySelector('.brand')?.getAttribute('aria-label')).toBe(
      'Exodus Office home',
    );
  });

  it('shows the active route title in the breadcrumb', async () => {
    await router.navigateByUrl('/departments');
    await fixture.whenStable();

    const breadcrumb = fixture.nativeElement.querySelector(
      '.breadcrumb-label strong',
    ) as HTMLElement;
    expect(breadcrumb.textContent?.trim()).toBe('Departments');
  });
});
