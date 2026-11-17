# Coding standards

Rules for all code in Exodus Office. The user's own instructions in a conversation take precedence over this file.

## TypeScript

- Use strict type checking.
- Prefer type inference when the type is obvious.
- Avoid the `any` type; use `unknown` when type is uncertain.

## Angular (v22)

### Angular best practices

- Always use standalone components over NgModules.
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management.
- Implement lazy loading for feature routes.
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead.
- Use `NgOptimizedImage` for all static images. `NgOptimizedImage` does not work for inline base64 images.

### Accessibility

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility.
- Use `input()` and `output()` functions instead of decorators.
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`.
- Use `computed()` for derived state.
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized.
- Prefer inline templates for small components.
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation.
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones.
- Do NOT use `ngClass`, use `class` bindings instead.
- Do NOT use `ngStyle`, use `style` bindings instead.
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`.
- When using external templates/styles, use paths relative to the component TS file.

### State management

- Use signals for local component state.
- Use `computed()` for derived state.
- Keep state transformations pure and predictable.
- Do NOT use `mutate` on signals, use `update` or `set` instead.

### Templates

- Keep templates simple and avoid complex logic.
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
- Use the async pipe to handle observables.
- Do not assume globals like (`new Date()`) are available.

### Services

- Design services around a single responsibility.
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+).
- Use the `inject()` function instead of constructor injection.

### Project conventions

- Folders: `core/` holds app-wide pieces (shell, config, HTTP, routing). `features/<name>/` holds a feature's model, API service, pages, and specs. `shared/` holds UI used by more than one feature.
- Every feature route is lazy-loaded with `loadComponent` in `app.routes.ts` and has a `title`.
- Services build URLs from the `API_BASE_URL` token (`core/config/api.config.ts`). Never hard-code a host.
- HTTP failures reach pages only as `ApiError` (`core/http/api-error.ts`), converted by the interceptor. Show `error.messages` to the user.
- User feedback goes through `NotificationService` (`shared/feedback/`). Never use `alert()`. Replace `confirm()` with an accessible dialog when a feature is touched.
- Every `@for` tracks by a stable ID, never `$index`.
- Pages show loading, empty, error-with-retry, and success states.
- Decorative glyphs and icons get `aria-hidden="true"`. Controls without behavior yet are `disabled`, not silently dead.
- Format with Prettier (`office-portal/.prettierrc`) before finishing.

## Styling with Bootstrap

- Use the latest stable Bootstrap 5 release. It is 5.3.9 as of 2026-11-17, already in `package.json`. Do not adopt a Bootstrap 6 alpha or beta; move to 6 only once it is stable, as its own planned change.
- Bootstrap is loaded as CSS only, from `angular.json` `styles`. Do not add `bootstrap.bundle.js` or use `data-bs-*` attributes. Angular owns behavior such as opening modals, menus, and dropdowns with signals and `@if`; Bootstrap provides the look.
- Reach for Bootstrap first: layout with the grid (`row`, `col-*`, `g-*`) and utilities (`d-flex`, `gap-*`, `mb-*`, `text-*`, `visually-hidden`), and markup with components (`btn`, `form-control`, `form-label`, `table`, `modal-*`, `badge`). Write custom CSS only for what Bootstrap does not cover.
- Theme through Bootstrap's CSS variables (`--bs-primary`, `--bs-body-font-family`, `--bs-border-radius`, and so on) in `src/styles.css`, not by overriding the same property in every component. The brand purple is `#7065df`.
- Component CSS files keep the workspace look; do not duplicate a rule that a Bootstrap class already provides.
- Icons: `bootstrap-icons` 1.13.2 is installed but not loaded yet. When replacing the Unicode glyphs (⌂, ✎, ⌫), add `node_modules/bootstrap-icons/font/bootstrap-icons.min.css` to `angular.json` styles and use `<i class="bi bi-..." aria-hidden="true"></i>`.
- Check color contrast against WCAG AA when changing colors; Bootstrap's defaults are not a guarantee once themed.

## .NET API (ASP.NET Core 10, EF Core 10)

- Folders: `Features/<Name>/` holds the controller, a `Contracts/` folder of request and response records, and a mapper. `Data/` holds the DbContext, `Entities/`, `Migrations/`, and `Seeding/`.
- Requests and responses are `sealed record` types. Never return or accept an EF entity at the API boundary.
- Field limits live in one static class such as `EmployeeLimits`. Validation attributes and `OnModelCreating` both read from it.
- Validate with data annotations; `[ApiController]` returns 400 `ValidationProblemDetails` automatically. Use `Problem(...)` for 404 and 409 so every error is RFC 9457 problem details.
- Routes are resources under `/api/v1/<plural>` and `/api/v1/<plural>/{id:int}`. Return 201 with `CreatedAtRoute` on create, 204 on delete.
- All database calls are async and take the request `CancellationToken`. Use `AsNoTracking()` for read-only queries.
- Configure the schema with the fluent API in `OnModelCreating`, not attributes on entities.
- Configuration: safe defaults in `appsettings.json`, local values in `appsettings.Development.json`, credentials in user secrets. Never commit a password or connection string with credentials.

## Database and migrations

- Every schema change is an EF migration in `Data/Migrations`.
- Once a migration has been applied anywhere, never edit it; add a new one.
- When a change affects existing data, add the conversion SQL to `Up` and its reverse to `Down` with `migrationBuilder.Sql(...)`, then test both directions with `dotnet ef database update <PreviousMigration>`.

## Data formats

- Mobile numbers are Philippine E.164: `^\+639[0-9]{9}$`, for example `+639171234567`. The same rule applies in the form and the API.
- Emails are trimmed and lower-cased before saving, and are unique.

## Testing

- Backend: xUnit in `employee.api.Tests`, mirroring the API's folder structure. Use `[Theory]` with `[InlineData]` for validation rules.
- Frontend: Vitest specs beside each class. Fake the API with `provideHttpClientTesting()` and `HttpTestingController`; call `http.verify()` in `afterEach`.
- Each phase adds tests for its exit criteria. Run both suites and a production build before reporting work as done.
