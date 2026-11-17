# Exodus Office

Employee management workspace for the Exodus home office, a development-stage team of five people and one client. It is a full-stack portfolio project: Angular 22 with Bootstrap 5.3, ASP.NET Core 10, EF Core 10, and SQL Server.

## Context files

Always loaded:

- @docs/context/coding-standards.md
- @docs/context/current-phase.md

Read when the task needs them:

- `docs/development-roadmap.md`: phases, requirement IDs, product decisions, phase status table.
- `docs/api/employees.md`: the employee API contract.
- `README.md`: architecture and local setup.
- `angular-cli` MCP server (`.mcp.json`): call `get_best_practices` before writing Angular code, and use `search_documentation` for Angular API questions instead of relying on memory.

## Commands

Web, from `office-portal/`:

- Dev server: `npm start` (http://localhost:4200)
- Build: `npm run build`
- Tests: `npx ng test --watch=false`
- Format: `npx prettier --write "src/**/*.{ts,html,css}"`

API, from `server/employee.api/`:

- Run: `dotnet run --project employee.api --launch-profile https` (https://localhost:7269, http://localhost:5291)
- Tests: `dotnet test employee.api.slnx`

Migrations, from `server/employee.api/employee.api/`:

- Add: `dotnet ef migrations add <Name> -o Data/Migrations`
- Apply: `dotnet ef database update` (also runs automatically when the API starts in Development)

## Working with Claude

- The user is learning each phase. Explain why a change is made and which skill it practices, not only what changed.
- Work on a `phase-N/short-name` branch. Never commit to `main` directly.
- Do not commit or push unless asked.
- When behavior changes, update `docs/api/employees.md`, the roadmap's phase status table, and `docs/context/current-phase.md`.

**IMPORTANT:** Do not add Claude to commit messages. No `Co-Authored-By` line and no mention of Claude or AI.

## Gotchas

- If `dotnet restore employee.api.slnx` fails with "Cannot create a file when that file already exists", restore each `.csproj` separately, then build with `--no-restore`.
- The development database is `ExodusOffice` on `(localdb)\MSSQLLocalDB`. The older `employeeDb` database is unused.
- The shell is Windows with Git Bash and PowerShell; prefer forward slashes in paths.
