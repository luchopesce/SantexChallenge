import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(
      withInterceptors([AuthInterceptor]) // Aquí proporcionamos el interceptor como función
    ),
  ],
};
