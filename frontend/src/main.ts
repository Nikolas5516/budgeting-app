
import 'primeicons/primeicons.css';

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import 'primeicons/primeicons.css';

import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('jwt');
          if (token) {
            req = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` }
            });
          }
          return next(req);
        }
      ])
    ),
    importProvidersFrom(FormsModule),
    providePrimeNG({
      theme: {
        preset: Lara,
      },
    }),
  ],
});
bootstrapApplication(App, {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('jwt');
          if (token) {
            req = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` }
            });
          }
          return next(req);
        }
      ])
    ),
    importProvidersFrom(FormsModule),
    providePrimeNG({
      theme: {
        preset: LaraLightTeal,
      },
    }),
  ],
});
bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));
