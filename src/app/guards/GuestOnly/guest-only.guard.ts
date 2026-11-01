import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../core/services/User/user.service';
import { catchError, map, of, switchMap } from 'rxjs';

export const guestOnlyGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);

  const feed = router.createUrlTree(['/feed']);

  if (userService.isUserLoggedIn()) {
    return feed;
  }

  // Sin sesión en memoria (ej. recarga en /auth/login): se consulta al backend. Se evita el refresh
  // automático del interceptor porque su redirección a /auth/login volvería a disparar este guard.
  return userService.me(true).pipe(
    map((rawUser: any) => {
      userService.setCurrentUser(userService.buildUser(rawUser));
      userService.setTokenExpireTime(new Date(rawUser.exp * 1000));
      return true;
    }),
    // El access token pudo haber vencido pero el refresh seguir vigente.
    catchError(() => userService.refreshSession().pipe(
      map(() => userService.isUserLoggedIn()),
      catchError(() => of(false)),
    )),
    map(isLoggedIn => isLoggedIn ? feed : true),
  );
};
