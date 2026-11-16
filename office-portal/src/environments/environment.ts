/**
 * Production environment. The build replaces this file with environment.development.ts
 * when serving locally (see angular.json "fileReplacements").
 *
 * The API is assumed to be served from the same origin until the hosting decision in Phase 2
 * sets a real origin.
 */
export const environment = {
  production: true,
  apiBaseUrl: '/api/v1',
};
