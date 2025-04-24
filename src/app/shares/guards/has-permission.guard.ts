import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../../security/security.service';
import { Observable, of, map, catchError } from 'rxjs';

export const hasPermissionGuard = (permission: string): CanActivateFn => {
  return () => {
    const securityService = inject(SecurityService);
    const router = inject(Router);
    
    // Primero verificamos si el usuario está autenticado
    if (!securityService.isLogged()) {
      router.navigate(['/']);
      return false;
    }
    
    // Verificamos si los permisos ya están cargados
    const currentPermissions = securityService.getPermissions();
    
    // Si ya hay permisos cargados, verificamos directamente
    if (currentPermissions.length > 0) {
      if (securityService.hasPermission(permission)) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    }
    
    // Si no hay permisos cargados aún pero hay un token,
    // cargamos los permisos antes de verificar
    return securityService.loadPermissions().pipe(
      map(() => {
        if (securityService.hasPermission(permission)) {
          return true;
        } else {
          router.navigate(['/']);
          return false;
        }
      }),
      catchError(() => {
        router.navigate(['/']);
        return of(false);
      })
    );
  };
};