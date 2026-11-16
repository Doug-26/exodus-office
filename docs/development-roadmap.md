# Exodus Office development roadmap

**Planning baseline:** 2026-11-14  
**Revision:** 2026-11-16 — Re-aligned to the project's real context: a portfolio full-stack project for the Exodus home office, a development-stage team of five members plus one client. Authentication moved to its own phase, a delivery/portfolio track added, enterprise-only items trimmed, and gaps found while checking the roadmap against the employee page UI were added to the requirements.  
**Status:** Active plan  
**Scope:** The visible Exodus Office workspace, starting with employee management. This is a living plan; phase order and scope may change through the change process below.

## Project context

- **What it is:** An employee management workspace for the Exodus home office. The office is in its development phase: five people who are looking for work, and one client. It is not a registered, running company.
- **Why it exists:** It is a portfolio project that demonstrates full-stack development with Angular, ASP.NET Core, EF Core, and SQL Server. Every phase should leave behind evidence a reviewer can see: a merged pull request, tests, a README section, screenshots, and (from Phase 2 on) a live demo.
- **Who builds it:** One developer who is also the product owner. Product decisions are made by the developer and written down in this document instead of waiting on a stakeholder.
- **Who uses it:** One administrator (the developer), the five team members, and optionally the client as a read-only viewer. Realistic data size is under ten employees and under five departments, so a seeded demo data set is needed to show search, paging, and reports properly.
- **How it is learned:** Each phase is organized so the developer practices one layer of the stack at a time and can explain how it was built. The "skills practiced" list in each phase is the study guide for that phase.

## Summary

Exodus Office currently has one Angular employee page and a small ASP.NET Core API backed by EF Core and SQL Server. The employee page is the only implemented product feature. Its UI already signals a broader people-operations workspace: employee status and metrics, search, filters, sorting, multi-selection, pagination, export, departments, attendance, reports, settings, notifications, profile controls, and help.

The plan is to make the employee directory a dependable, data-backed feature, secure it, then add the visible workspace areas in dependency order. Keep the current Angular + .NET + SQL Server stack as a single Angular app and a single modular API. No microservices, no separate service per screen.

## What exists today

| Area | Current implementation | Consequence for the plan |
|---|---|---|
| Frontend | The root app renders `EmployeeCrud`; the route list is empty. The employee component contains the page shell, navigation, metrics, form, table, and styles. | Split the shared workspace layout from routed feature pages before adding more screens. |
| Employee data | The Angular model and EF entity contain ID, name, mobile, email, city, region, and address. Mobile is a 10-digit string. Email is required in the form but not in the entity. | Add status and hire date in Phase 1 with a migration. Align entity validation with the form. |
| Employee API | `EmployeeController` exposes get-all, create, update, and delete actions on verb-named routes. It uses synchronous EF Core calls and returns the EF entity directly. A template `WeatherForecastController` is still present. | Introduce DTOs, resource routes, async access, explicit validation, and remove the template controller. |
| Frontend API calls | The component calls `https://localhost:7269` directly. It reloads the entire list after each mutation and has no loading or request-error state. | Centralize the base URL in an environment file and an employee API service; make loading, empty, validation, and error states part of each feature's acceptance criteria. |
| Data integrity | The update action copies email, mobile, city, region, and address, but not the employee name. Delete physically removes the row. | Fix the name update and choose the lifecycle policy (soft deactivate by default) before adding status history or reports. |
| Workspace controls | Navigation uses `#` links. Search, Filter, Sort, Export, checkboxes, and pagination have no handlers. Summary numbers, the nav count, the record count, the row avatar initials, the row phone, the row subtitle, and the status badge are literal text. | Treat these as planned features. Each placeholder gets a defined behavior and a real data source. |
| Branding | The sidebar and page title say Exodus Office, but the brand link label and page footer still say PeopleHub. | Make the product name consistent in Phase 0. |
| Security | The API has a development CORS origin and `UseAuthorization()` but no authentication. The SQL Server connection string lives in local settings. | Add ASP.NET Core Identity with JWT in Phase 2. Keep secrets out of tracked settings. |
| Verification | The Angular tests are smoke tests. No backend test project and no EF migration files are tracked. | Add migrations in Phase 0, a backend test project in Phase 1, and focused tests with every phase. |

Main implementation references: [employee-crud.html](../office-portal/src/app/employee-crud/employee-crud.html), [employee-crud.ts](../office-portal/src/app/employee-crud/employee-crud.ts), [EmployeeController.cs](../server/employee.api/employee.api/Controllers/EmployeeController.cs), [EmployeeModel.cs](../server/employee.api/employee.api/Models/EmployeeModel.cs), and [Program.cs](../server/employee.api/employee.api/Program.cs).

## UI feature inventory and requirement IDs

The requirement IDs are stable across roadmap revisions. Status describes the repository, not the desired end state.

| ID | Feature visible in the UI | Current status |
|---|---|---|
| REQ-001 | Employee directory with name, ID, contact, location, and status | List is loaded from the API. Avatar initials, phone, row subtitle (department), status badge, nav count, and record count are hard-coded. |
| REQ-002 | Create, edit, and delete employee records | Create and delete call the API. Edit opens the form, but the API does not save name changes. Native alerts and confirm dialogs are used; API failures are not shown. |
| REQ-003 | Employee summary cards: total, active, departments, and new this month, with a month-over-month trend | Static sample values; no summary API or agreed metric definitions. |
| REQ-004 | Search, filter, and sort the directory | Controls are visual only. |
| REQ-005 | Select rows, select all, and move between pages | Checkboxes and page buttons are visual only. The "showing" range is static. |
| REQ-006 | Export the directory | Button is visual only. |
| REQ-007 | Departments page, department count, and employee department labels (row subtitle) | Navigation and count are visual only. No Department model or API exists. |
| REQ-008 | Attendance page | Navigation is visual only. No attendance screen design exists. |
| REQ-009 | Overview and reports | Navigation items only; no routes or report API. |
| REQ-010 | Settings, administrator profile menu, notifications badge, and help center | Visible shell controls only. |
| REQ-011 | Authenticated, role-controlled workspace access | Inferred from the "Administrator" profile. No sign-in flow or server-side policy exists. |
| REQ-012 | Consistent product branding and accessible markup | New in this revision. PeopleHub name remains in two places; a row checkbox label contains stray backticks; the table tracks rows by index instead of ID; the "Required fields" note has no matching markers on the labels. |

## Target structure

Keep one deployable Angular app and one deployable .NET API, organized by feature.

Frontend boundaries:

- `office-portal/src/app/core/`: environment-based API base URL, auth service and interceptor, route guards, shared error handling, workspace shell (sidebar, top bar, page frame).
- `office-portal/src/app/features/employees/`: employee page, table, editor, filter controls, employee API service.
- `office-portal/src/app/features/auth/`, `departments/`, `overview/`, `reports/`, `attendance/`, `settings/`: routed feature pages added in their phases, lazy-loaded.
- `office-portal/src/app/shared/`: reusable UI pieces only after more than one feature needs them.

Backend boundaries within the existing API project:

- Keep `EmployeeDbContext` and SQL Server as the persistence boundary; add Identity tables in Phase 2.
- Request/response DTOs per feature; never return EF entities as the public contract.
- Application services where query rules justify them; keep simple CRUD direct and readable.
- Problem Details error responses, async EF Core queries, and per-environment CORS, connection, and JWT settings.

Resource routes (contract targets):

| Feature | Route contract |
|---|---|
| Employees | `GET /api/v1/employees` with search/filter/sort/page parameters; `GET /api/v1/employees/{id}`; `POST /api/v1/employees`; `PUT /api/v1/employees/{id}`; `PATCH /api/v1/employees/{id}/status`; `DELETE /api/v1/employees/{id}` (administrator only). |
| Auth | `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `GET /api/v1/auth/me`. |
| Employee summary | `GET /api/v1/dashboard/employee-summary` with a defined reporting period and metric semantics. |
| Departments | `GET/POST /api/v1/departments`, `GET/PUT/DELETE /api/v1/departments/{id}`; employee responses include the assigned department summary. |
| Export | `GET /api/v1/employees/export` reusing the directory query parameters and an optional `ids` list; returns CSV. |
| Attendance | Specified in Phase 6 after the workflow is designed. |

## Product decisions (defaults the developer owns)

These replace the earlier "decisions to confirm" list. Change them here when a phase needs something different.

| Topic | Decision |
|---|---|
| Employees in scope | The five team members, maintained by the administrator. The client is not an employee record. |
| Roles | `Administrator` (full access) and `Employee` (view directory, edit own profile). An optional `Client` role with read-only Overview/Reports access is decided in Phase 2. |
| Identity | ASP.NET Core Identity with JWT bearer tokens, hosted in the same API. No external identity provider; this keeps the demo free and shows the skill end to end. |
| Employee status | `Active`, `OnLeave`, `Inactive`. This is employment status; daily attendance status is a separate concept in Phase 6. |
| Lifecycle | Ordinary departures set `Inactive`. Hard delete is administrator-only and requires explicit confirmation. |
| Phone format | Philippine mobile number stored as 10 digits (matches the current entity); displayed as `+63 XXX XXX XXXX`. Validate on both form and API. |
| Row subtitle | The employee's department name; "Unassigned" until Phase 4 ships. |
| Avatar initials | First letters of the first and last word of the employee name, with a color chosen deterministically from the ID. |
| New this month | Counted from a `HireDate` field, calendar month in Asia/Manila. The trend compares headcount at month end with the previous month end using the hire date and the inactive date. |
| Paging | Default page size 10, options 10/25/50. Changing search, filter, or sort returns to page 1. Selection is cleared when the page changes. |
| Export | CSV. Exports all selected rows, or all records matching the active filters when nothing is selected. Never only the current page. |
| Demo data | A seed script creates the five real team members plus a labeled demo set (about 40 employees, 6 departments) that can be toggled on for screenshots and reviews. |
| Hosting | Decided in Phase 0 from free tiers: Angular on GitHub Pages, Vercel, or Netlify; API and SQL on Azure free tier or an equivalent provider. Local development uses SQL Server LocalDB or SQL Server in Docker. |

## How each phase is developed

Every phase follows the same loop so the process itself becomes a habit you can describe in interviews:

1. Create a branch `phase-N/short-name`. Read the phase section and write or update the API contract in `docs/api/` before coding.
2. Backend first: entity and migration, DTOs and validation, endpoint, backend tests. Verify with the `.http` file or the OpenAPI UI.
3. Frontend second: API service, state in signals, template, loading/empty/error states, component tests.
4. Run both test suites, update the README section for the phase with a screenshot or short GIF, and open a pull request against `main` with a checklist that mirrors the exit criteria.
5. Merge, tag `vN.0`, and (from Phase 2) deploy the demo.
6. Update this roadmap's status table and note anything learned that changes a later phase.

## Phased implementation plan

### Phase 0 — Foundation and project hygiene

**Purpose:** Establish the app structure, configuration, and tooling so every later phase is built the same way.

**Frontend work**

- Add real routes and a lazy-loaded Employees page. Extract the sidebar, top bar, and page frame into a workspace shell in `core/`.
- Add `environment.ts` / `environment.development.ts` with the API base URL and an `EmployeeApiService`. Remove the hard-coded localhost URL from the component.
- Fix REQ-012 items: product name, checkbox label, `track employee.empId`, required-field markers.
- Define the shared loading, empty, validation, and error presentation pattern (a small toast/alert component and a form error helper).

**Backend and data work**

- Remove the WeatherForecast template. Rename routes to `/api/v1/employees`. Add DTOs, async EF Core access, Problem Details responses, and model validation that matches the form.
- Add EF Core migrations and a documented local setup (connection string via user secrets or environment variables, `dotnet ef database update`).
- Add the seed script with the five team members behind a development flag.
- Add a GitHub Actions workflow that builds and tests both projects on every pull request.

**Skills practiced:** Angular standalone routing and lazy loading, environment configuration, HttpClient services; ASP.NET Core configuration, DTO mapping, async EF Core, migrations; GitHub Actions basics.

**Portfolio evidence:** README with architecture diagram and local setup; green CI badge; first tagged release.

**Exit criteria:** The app uses routed pages and a shared shell; the employee page no longer constructs URLs; the API uses resource routes and DTOs; schema changes are reproducible by migration; CI passes on `main`.

### Phase 1 — Reliable employee records

**Requirements:** REQ-001, REQ-002.  
**Depends on:** Phase 0.

**Frontend work:** Complete the list, create/edit form, and row actions. Bind avatar initials, phone display, status badge, nav count, and record count to returned data. Convert the form to reactive forms with field-level validation messages. Replace native alerts and confirms with the shared feedback pattern and a confirm dialog. Add loading, empty, saving, success, and failure states.

**Backend/data work:** Add `Status`, `HireDate`, `InactiveDate`, and `CreatedAt` with a migration. Fix the missing name update. Enforce unique email. Return 404/400/409 with Problem Details. Add a status endpoint for deactivation. Add an xUnit test project with endpoint tests on a test database.

**Skills practiced:** Reactive forms and validators, signal-based state, accessible dialogs; EF Core schema evolution, validation, HTTP semantics, integration testing with `WebApplicationFactory`.

**Portfolio evidence:** PR with before/after screenshots of the form and error states; test counts in the README.

**Exit criteria:** Create, read, edit, deactivate, and delete work end to end; edits persist every editable field; no row content or count is hard-coded; validation and API failures are understandable to the user; backend tests cover each endpoint.

### Phase 2 — Authentication, roles, and first deployment

**Requirements:** REQ-011.  
**Depends on:** Phase 1.

**Frontend work:** Add a login page, auth service with token storage and refresh, HTTP interceptor, route guards, and role-aware navigation. Show the signed-in user's name and initials in the sidebar and top bar instead of the hard-coded administrator.

**Backend/data work:** Add ASP.NET Core Identity tables with a migration, JWT issuance and validation, role seeding (Administrator, Employee, optional Client), and `[Authorize]` policies on every employee endpoint. Link an Identity user to an employee record. Move secrets to user secrets locally and provider settings in hosting.

**Delivery work:** Provision the hosting chosen in Phase 0, configure production CORS and connection settings, and deploy both apps. Add a deploy job to the CI workflow.

**Skills practiced:** Identity and JWT, authorization policies, Angular interceptors and guards, secure configuration, cloud deployment and environment separation.

**Portfolio evidence:** Live demo URL with a demo administrator account; README security section describing the token flow.

**Exit criteria:** Unauthenticated requests to employee endpoints are rejected; the administrator can manage records and an employee cannot delete; the demo is reachable online and contains no development URL or credential in source.

### Phase 3 — Directory search, filters, sorting, paging, and export

**Requirements:** REQ-004, REQ-005, REQ-006.  
**Depends on:** Phase 1. Department filtering is added after Phase 4.

**Frontend work:** Make search (debounced), filter (status, city/region), sort, selection, page navigation, page size, and Export functional. Reflect query state in the URL so a filtered view is shareable. Announce result and selection counts accessibly.

**Backend/data work:** Add validated query parameters and a paged response (`items`, `totalCount`, `page`, `pageSize`). Whitelist sort fields. Implement the CSV export from the same query. Enable the demo seed so the feature is visible with realistic volume.

**Skills practiced:** Query composition with `IQueryable`, paging contracts, RxJS debouncing, Angular query-param state, file downloads.

**Portfolio evidence:** GIF of search/filter/page working on the demo; export sample in the README.

**Exit criteria:** Search/filter/sort/page combinations return stable results; the displayed range and total match the API; export matches selected rows or active filters as decided.

### Phase 4 — Departments and employee assignment

**Requirements:** REQ-007.  
**Depends on:** Phase 1. Can run in parallel with Phase 3.

**Frontend work:** Add a Departments route with list, detail, and editor. Show the department as the employee row subtitle; add a department selector to the employee form and a department filter to the directory.

**Backend/data work:** Add the Department entity, migration, DTOs and routes, and a nullable `DepartmentId` on employees. Block deletion of a department that still has employees, or reassign them explicitly. Replace the static department card with a real count.

**Skills practiced:** Relational modeling and foreign keys in EF Core, nested DTOs, referential-integrity rules, a second feature module built from the Phase 0 pattern.

**Exit criteria:** Departments can be managed; employees can be assigned and filtered; counts come from stored records; department changes cannot leave invalid employee references.

### Phase 5 — Overview and reports

**Requirements:** REQ-003, REQ-009.  
**Depends on:** Phase 1 for employee metrics, Phase 4 for department metrics.

**Frontend work:** Add the Overview route as the default landing page. Make the four summary cards dynamic and show the reporting period. Add a Reports route with a headcount-by-department view and a hires-by-month view, each filterable and exportable.

**Backend/data work:** Add summary and report endpoints with the formulas from the product decisions table. Compute the month-over-month trend from hire and inactive dates. Reuse the directory query rules for report filters.

**Skills practiced:** Aggregation queries, date handling across time zones, chart rendering in Angular, API design for reporting.

**Exit criteria:** Every dashboard value has a named formula and period; API results agree with displayed values; no sample totals remain.

### Phase 6 — Attendance

**Requirements:** REQ-008.  
**Depends on:** Phase 2; Phase 4 if grouped by department.

**Design gate:** The UI only has an Attendance navigation item. Before building, write a one-page design in `docs/attendance-design.md`: manual daily check-in by each employee with administrator correction, statuses (Present, Late, Absent, Leave), work day defined in Asia/Manila, one record per employee per day.

**Frontend work:** Add the Attendance route with a today view for the signed-in employee and a month grid for the administrator, plus a correction dialog.

**Backend/data work:** Add the attendance entity, unique employee-plus-date constraint, date-range queries, role rules (employees record their own day, administrators correct any), and a correction audit trail.

**Skills practiced:** Per-user authorization rules, unique constraints, calendar UI, audit logging.

**Exit criteria:** The agreed scenarios are acceptance tests; records are traceable to employee and date; time-zone and correction rules are tested; employment status is not confused with daily attendance.

### Phase 7 — Workspace controls and portfolio finish

**Requirements:** REQ-010, remaining REQ-012.  
**Depends on:** Phase 2 and the routes that settings and notifications configure.

**Frontend work:** Implement Settings (profile, password change, display preferences), the profile menu (sign out), the help center page, and a notifications panel fed by real events (for example, a new hire or an attendance correction). Hide any control that has no behavior rather than leaving it dead.

**Backend/operations work:** Notification events and a read/unread endpoint, logging, a health check endpoint, and a short runbook for restoring the database from a backup.

**Portfolio work:** Final README pass with a feature tour, architecture section, screenshots per phase, and a "what I learned" section; a short demo video; a case study post if desired.

**Exit criteria:** Every visible control has an implemented route or is intentionally hidden; protected APIs enforce roles server-side; production configuration has no development URL or credential; the README is complete enough that a reviewer understands the project without running it.

## Phase dependency map

```text
Phase 0 (foundation, routes, DTOs, migrations, CI)
  └── Phase 1 (reliable employee records)
        ├── Phase 2 (auth, roles, first deployment)
        │     ├── Phase 6 (attendance; also Phase 4 if grouped by department)
        │     └── Phase 7 (workspace controls, portfolio finish)
        ├── Phase 3 (directory operations; department filter after Phase 4)
        └── Phase 4 (departments)
              └── Phase 5 (overview and reports)
```

Suggested order of work: 0, 1, 2, 3, 4, 5, 6, 7. Phases 3 and 4 can be swapped or interleaved.

## Requirement-to-phase mapping

| Requirement | Planned phase | Completion evidence |
|---|---|---|
| REQ-001 Employee directory data | Phase 1 | Every displayed field and count is backed by API responses. |
| REQ-002 Employee create/edit/delete | Phase 1 | CRUD acceptance flows, validation responses, lifecycle policy, backend tests. |
| REQ-003 Employee summary cards | Phase 5 | Documented formulas and API-backed values. |
| REQ-004 Search/filter/sort | Phase 3, extended in Phase 4 | Query contract and verified combinations in the UI. |
| REQ-005 Selection and pagination | Phase 3 | Stable paged response and selection behavior. |
| REQ-006 Export | Phase 3 | CSV export matching selection or filters. |
| REQ-007 Departments | Phase 4 | Department CRUD, assignment, dynamic count and row subtitle. |
| REQ-008 Attendance | Phase 6 | Design doc, API/data contract, acceptance scenarios. |
| REQ-009 Overview and reports | Phase 5 | Routed views, metric definitions, report queries. |
| REQ-010 Settings/profile/notifications/help | Phase 7 | Every shell control has its approved behavior or is hidden. |
| REQ-011 Authentication and authorization | Phase 2; hardening in Phase 7 | Sign-in, server-enforced roles, live demo. |
| REQ-012 Branding and accessible markup | Phase 0; final pass in Phase 7 | No PeopleHub text, valid labels, ID-based tracking. |

## Phase status

| Phase | Status | Tag | Notes |
|---|---|---|---|
| 0 | Not started | | |
| 1 | Not started | | |
| 2 | Not started | | |
| 3 | Not started | | |
| 4 | Not started | | |
| 5 | Not started | | |
| 6 | Not started | | |
| 7 | Not started | | |

## How to revise phases without losing downstream alignment

1. Update the affected `REQ-XXX` description and acceptance criteria; keep the ID if the user outcome is the same, and retire and supersede it explicitly if not.
2. Record the changed UI behavior, API contract, data fields, validation, and migration impact in that phase before implementation starts.
3. Use the dependency map to find downstream phases. Mark each affected item as **unchanged**, **needs contract update**, **needs data migration**, or **blocked pending decision**.
4. Update only the affected tasks and criteria, then revise the dependency map and the requirement-to-phase mapping.
5. Recheck impacted phases' exit criteria after the earlier phase ships. A change to employee status, for example, must be rechecked against directory filters, dashboard counts, attendance, and reports.
6. Add a revision line at the top of this document with the date and a short change note.
