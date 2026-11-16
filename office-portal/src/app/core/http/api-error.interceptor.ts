import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './api-error';

/** Converts every failed HTTP response into an {@link ApiError} so features never parse raw responses. */
export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(catchError((error: unknown) => throwError(() => ApiError.from(error))));
