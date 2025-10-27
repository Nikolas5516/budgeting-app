import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {routes} from './app.routes';
import {providePrimeNG} from 'primeng/config';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import LaraLightTeal from '@primeuix/themes/aura';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {BASE_PATH} from './api';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: LaraLightTeal,
        options: {
          darkModeSelector: null,
        }
      }
    }),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        AuthInterceptor,
        ErrorInterceptor
      ])
    ),

    provideAnimations(),

    importProvidersFrom(ToastModule),

    MessageService,
    { provide: BASE_PATH, useValue: '' }
  ]
};
