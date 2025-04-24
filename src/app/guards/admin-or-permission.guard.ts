import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../security/security.service';
import { catchError, map, of } from 'rxjs';

export const adminOrPermissionGuard = (permission: string): CanActivateFn => {
  return () => {

    const securityService = inject(SecurityService);
    const router = inject(Router);

    if(!securityService.isLogged()){
      router.navigate(['/']);
      return false;
    }

    const isAdmin = securityService.getRol().includes('Administrador');
    const currentPermissions = securityService.getPermissions();

    if(isAdmin) return true;

    if(currentPermissions.length > 0){
      if(securityService.hasPermission(permission)){
        return true;
      }else{
        router.navigate(['/']);
        return false;
      }
    }

    return securityService.loadPermissions().pipe(
      map(() => {
        if(securityService.hasPermission(permission)){
          return true;
        }else{
          router.navigate(['']);
          return false;
        }
      }),
      catchError(() => {
        router.navigate(['/']);
        return of(false);
      })
    )
  };
};
