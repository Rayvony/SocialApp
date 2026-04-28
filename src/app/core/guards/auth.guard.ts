import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@store/index';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);
  const isLoggedIn = authStore.isAuthenticated();
  const isLoginRoute = route.routeConfig?.path === 'login';

  if (isLoggedIn && isLoginRoute) return router.createUrlTree(['/feed']);
  if (!isLoggedIn && !isLoginRoute) return router.createUrlTree(['/login']);
  return true;
};
