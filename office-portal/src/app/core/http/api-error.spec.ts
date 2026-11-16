import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './api-error';

describe('ApiError', () => {
  it('maps a network failure to a reachability message', () => {
    const error = ApiError.from(new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' }));

    expect(error.status).toBe(0);
    expect(error.message).toContain('API is running');
  });

  it('reads title, detail, and field errors from problem details', () => {
    const error = ApiError.from(
      new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: {
          title: 'One or more validation errors occurred.',
          status: 400,
          errors: { Mobile: ['Mobile is invalid.'], Email: ['Email is required.'] },
        },
      }),
    );

    expect(error.isValidation).toBe(true);
    expect(error.title).toBe('One or more validation errors occurred.');
    expect(error.messages).toEqual(['Mobile is invalid.', 'Email is required.']);
  });

  it('uses detail as the message for a not-found problem', () => {
    const error = ApiError.from(
      new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: { title: 'Employee not found', detail: 'No employee exists with ID 9.' },
      }),
    );

    expect(error.isNotFound).toBe(true);
    expect(error.message).toBe('No employee exists with ID 9.');
    expect(error.messages).toEqual(['No employee exists with ID 9.']);
  });

  it('falls back to the status text when the body is not problem details', () => {
    const error = ApiError.from(
      new HttpErrorResponse({ status: 502, statusText: 'Bad Gateway', error: '<html>' }),
    );

    expect(error.message).toBe('Bad Gateway');
  });

  it('returns the same instance when given an ApiError', () => {
    const original = new ApiError(500, 'Boom', undefined, {});
    expect(ApiError.from(original)).toBe(original);
  });
});
