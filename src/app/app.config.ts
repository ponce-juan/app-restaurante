import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorAuthorizationHandlerInterceptor } from './core/interceptors/error.authorization.handler-interceptor';
import { authorizationHandlerInterceptor } from './core/interceptors/authorization.handler-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors(
      [
        authorizationHandlerInterceptor,
        errorAuthorizationHandlerInterceptor
      ])),
  ]
};
