import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/authInterceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
      authInterceptor
    ])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false // Ensures it locks to light mode, or use '.my-dark-mode'
        }
      },
    })
  ]
};

export const PROD_enviroment: any = {
  BASE_URI: "http://utn-nest-social-api-prog-iv.vercel.app:80/"
}

export const LOCAL_enviroment: any = {
  BASE_URI: "http://localhost:3000/"
}
export const enviroment: any = LOCAL_enviroment;

