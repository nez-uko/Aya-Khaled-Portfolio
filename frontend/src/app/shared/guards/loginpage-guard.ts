import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const loginpageGuard: CanActivateFn = (route, state) => {
  const auth= inject(AuthService);
  const router= inject(Router);

  if(auth.isLoggedIn()){
    router.navigateByUrl("/ayaDashboard");
    return false;
  }

  return true;
};
