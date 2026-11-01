import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { SKIP_TOKEN_REFRESH, UserService } from '../../services/User/user.service';
import { Router } from '@angular/router';

// En estos endpoints un 401 es una respuesta esperada (credenciales incorrectas, email existente, etc.)
const AUTH_URLS = [
  '/authentication/refresh-token',
  '/authentication/login',
  '/authentication/logout',
  '/authentication/register',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const userService = inject(UserService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status !== 401 || req.context.get(SKIP_TOKEN_REFRESH) || AUTH_URLS.some(url => req.url.includes(url))) {
        return throwError(() => error);
      }

      return userService.refreshSession().pipe(
        catchError(() => {
          userService.clearSession();
          router.navigate(['/auth/login']);
          return throwError(() => error);
        }),
        // Fuera del catchError anterior: si el reintento falla, ese error llega tal cual a quien hizo la petición.
        switchMap(() => next(req)),
      );
    }),
  );
};
