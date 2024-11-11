import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { first, map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getAuthStatus().pipe(
    first(),
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['/account']);
      }
    }),
    map((isLoggedIn) => isLoggedIn)
  );
};
