import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../../security/security.service';

export const isAuthGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const securityService = inject(SecurityService);

  if(securityService.isLogged()){
    return true;
  }

  router.navigate(['/']);

  return false;
};
