# Employees API contract

**Base path:** `/api/v1/employees`  
**Status:** Implemented in Phase 0. Fields marked *Phase 1* are planned and not yet present.

## Employee resource

| Field | Type | Rules |
|---|---|---|
| `id` | integer | Server-generated. Read-only. |
| `name` | string | Required, 2–100 characters, trimmed. |
| `mobile` | string | Required. Philippine mobile: exactly 10 digits starting with 9, no `+63`. Example `9171234567`. The UI formats it as `+63 917 123 4567`. |
| `email` | string | Required, valid email, up to 254 characters, stored lower-case, unique across employees. |
| `city` | string | Required, up to 100 characters. |
| `region` | string | Required, up to 100 characters. |
| `address` | string | Required, up to 500 characters. |
| `status` | enum | *Phase 1.* `Active`, `OnLeave`, `Inactive`. |
| `hireDate` | date | *Phase 1.* Drives "new this month". |

Example response body:

```json
{
  "id": 1,
  "name": "Maria Santos",
  "mobile": "9171234567",
  "email": "maria.santos@example.com",
  "city": "Naga",
  "region": "Bicol",
  "address": "Concepcion Pequeña"
}
```

## Endpoints

| Method and path | Request body | Success | Errors |
|---|---|---|---|
| `GET /api/v1/employees` | none | `200` array of employees ordered by name. Paging, search, filter, and sort parameters arrive in Phase 3. | |
| `GET /api/v1/employees/{id}` | none | `200` employee | `404` |
| `POST /api/v1/employees` | all fields except `id` | `201` employee, `Location` header to the new item | `400` validation, `409` email in use |
| `PUT /api/v1/employees/{id}` | all fields except `id`; every field is replaced | `200` employee | `400` validation, `404`, `409` email in use |
| `DELETE /api/v1/employees/{id}` | none | `204` | `404` |

Phase 1 adds `PATCH /api/v1/employees/{id}/status` for deactivation and restricts `DELETE` to administrators in Phase 2.

## Error format

Every error is an RFC 9457 problem details document with `application/problem+json`.

Validation failure (`400`):

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Mobile": ["Mobile must be 10 digits starting with 9, for example 9171234567."],
    "Email": ["The Email field is not a valid e-mail address."]
  }
}
```

Not found (`404`) and conflict (`409`) use `title` and `detail`:

```json
{
  "title": "Employee not found",
  "status": 404,
  "detail": "No employee exists with ID 9."
}
```

The Angular client converts every failure into an `ApiError` (see `office-portal/src/app/core/http/api-error.ts`) so pages read `messages` rather than raw responses.
