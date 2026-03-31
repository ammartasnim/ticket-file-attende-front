import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { map, of, catchError } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[];

  if (authService.currentUser) {
    const hasRole = expectedRoles.includes(authService.currentUser.role);
    return hasRole ? true : router.createUrlTree(['/login']);
  }

  return authService.getMe().pipe(
    map((user) => {
      if (user && expectedRoles.includes(user.role)) {
        return true;
      }
      return router.createUrlTree(['/login']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};