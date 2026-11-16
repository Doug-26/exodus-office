import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideApiConfig } from './core/config/api.config';
import { apiErrorInterceptor } from './core/http/api-error.interceptor';
import { AppTitleStrategy } from './core/routing/app-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([apiErrorInterceptor])),
    provideApiConfig(),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
};
