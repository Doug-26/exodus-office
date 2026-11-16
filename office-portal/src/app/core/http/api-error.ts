import { HttpErrorResponse } from '@angular/common/http';

/** RFC 9457 problem details as produced by ASP.NET Core's `AddProblemDetails()` and `[ApiController]` validation. */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

/** Normalized API failure. Every HTTP error leaves the interceptor as one of these. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly title: string,
    readonly detail: string | undefined,
    readonly fieldErrors: Readonly<Record<string, string[]>>,
  ) {
    super(detail ?? title);
    this.name = 'ApiError';
  }

  get isValidation(): boolean {
    return this.status === 400 && Object.keys(this.fieldErrors).length > 0;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** Everything the user should read: field messages when present, otherwise the summary. */
  get messages(): string[] {
    const fieldMessages = Object.values(this.fieldErrors).flat();
    return fieldMessages.length > 0 ? fieldMessages : [this.message];
  }

  static from(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return new ApiError(
          0,
          'Cannot reach the API',
          'Check that the API is running and reachable.',
          {},
        );
      }

      const problem = isProblemDetails(error.error) ? error.error : undefined;
      return new ApiError(
        error.status,
        problem?.title ?? (error.statusText || 'Request failed'),
        problem?.detail,
        problem?.errors ?? {},
      );
    }

    return new ApiError(
      -1,
      'Unexpected error',
      error instanceof Error ? error.message : undefined,
      {},
    );
  }
}

function isProblemDetails(body: unknown): body is ProblemDetails {
  return (
    typeof body === 'object' &&
    body !== null &&
    ('title' in body || 'detail' in body || 'errors' in body)
  );
}
