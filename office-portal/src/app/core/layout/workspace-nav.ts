export interface WorkspaceNavItem {
  readonly label: string;
  readonly path: string;
  /** Decorative glyph; hidden from assistive technology in the template. */
  readonly icon: string;
}

/** Sidebar entries in display order. Every path has a route; unfinished areas show a placeholder page. */
export const WORKSPACE_NAV: readonly WorkspaceNavItem[] = [
  { label: 'Overview', path: '/overview', icon: '⌂' },
  { label: 'Employees', path: '/employees', icon: '♙' },
  { label: 'Departments', path: '/departments', icon: '▦' },
  { label: 'Attendance', path: '/attendance', icon: '◷' },
  { label: 'Reports', path: '/reports', icon: '▤' },
];
