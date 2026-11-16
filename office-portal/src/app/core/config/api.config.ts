import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Base URL of the Exodus Office API, including the version segment (for example `https://localhost:7269/api/v1`). */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

/** Registers the API base URL from the active environment file. Tests override the token directly. */
export function provideApiConfig(): Provider {
  return { provide: API_BASE_URL, useValue: environment.apiBaseUrl };
}
