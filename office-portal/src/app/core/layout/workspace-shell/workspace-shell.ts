import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ToastStack } from '../../../shared/feedback/toast-stack/toast-stack';
import { WORKSPACE_NAV } from '../workspace-nav';

/** Sidebar, top bar, and page frame shared by every routed page. Pages render in the outlet. */
@Component({
  selector: 'app-workspace-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastStack],
  templateUrl: './workspace-shell.html',
  styleUrl: './workspace-shell.css',
})
export class WorkspaceShell {
  private readonly router = inject(Router);

  protected readonly navItems = WORKSPACE_NAV;
  protected readonly year = new Date().getFullYear();

  /** Static until Phase 2 supplies the signed-in user. */
  protected readonly currentUser = {
    name: 'Christian De La Cruz',
    role: 'Administrator',
    initials: 'CD',
  };

  /** Title of the deepest active route, shown in the breadcrumb. */
  protected readonly pageTitle = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.activeRouteTitle()),
    ),
    { initialValue: this.activeRouteTitle() },
  );

  private activeRouteTitle(): string {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.title ?? '';
  }
}
