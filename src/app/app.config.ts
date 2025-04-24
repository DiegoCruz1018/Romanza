import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { authInterceptor } from './security/token-interceptor-https';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withComponentInputBinding()), 
    provideAnimationsAsync(),
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {subscriptSizing: 'dynamic'}},
    provideMomentDateAdapter({
      parse: {
        dateInput: ['DD-MM-YYYY'] // Formato esperado para la entrada de fechas
      },
      display: {
        dateInput: 'DD-MM-YYYY', // Formato de fecha mostrado en la entrada
        monthYearLabel: 'MMM YYYY', // Formato de la etiqueta de mes y año
        dateA11yLabel: 'LL', // Formato de accesibilidad para la fecha
        monthYearA11yLabel: 'MMMM YYYY' // Formato de accesibilidad para la etiqueta de mes y año
      }
    }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])), //Nos ayudar a obtener las peticiones Http del web api
    importProvidersFrom([SweetAlert2Module.forRoot()]),    // Importa y configura el módulo SweetAlert2 para toda la aplicación
  ]
};
