# Current phase

Replace this file's contents at the start of each phase. The full plan is in `docs/development-roadmap.md`.

## Status as of 2026-11-17

- **Phase 0 (foundation):** done and pushed on branch `phase-0/foundation`. A pull request into `main` is still to be opened; CI runs on pull requests.
- **Next: Phase 1 (reliable employee records).** Requirements REQ-001 and REQ-002. Not started.

## Phase 1 scope

**Backend and data**

- Add `Status` (`Active`, `OnLeave`, `Inactive`), `HireDate`, `InactiveDate`, and `CreatedAt` to the employee, with a migration. Existing rows become `Active`, with a hire date chosen during the migration.
- Add `PATCH /api/v1/employees/{id}/status` for deactivation. Ordinary departures set `Inactive`; hard delete stays available.
- Add the new fields to the request and response records and to `docs/api/employees.md`.
- Catch the unique-email database error on concurrent saves and return 409 instead of 500.
- Add integration tests that host the API with `WebApplicationFactory<Program>` and cover every endpoint.

**Frontend**

- Move the employee editor to Signal Forms with schema validation and messages under each field.
- Show the real status badge and hire date. Bind the sidebar employee count to data.
- Replace `confirm()` with an accessible confirm dialog. Manage focus when the editor and dialog open and close.
- Optionally accept `09…` or spaced mobile input and normalize it to `+639XXXXXXXXX` before sending.

## Exit criteria

- Create, read, edit, deactivate, and delete work end to end.
- Edits persist every editable field.
- No row content or count is hard-coded, except the summary cards and paging owned by Phases 3 and 5.
- Validation and API failures are understandable to the user, shown beside the field where possible.
- Backend integration tests cover each endpoint. Both test suites and the production build pass.

## Open decisions

- How to pick the hire date for existing rows in the migration: the date the migration runs, or a fixed date entered per team member.
- Whether `OnLeave` employees count as active in the Phase 5 summary cards.
