import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, switchMap, throwError } from 'rxjs';
import { UserService } from '../../services/User/user.service';
import { Router } from '@angular/router';
import { User } from '../../../classes/user/user';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const userService = inject(UserService);
  const router = inject(Router);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 && error.message.includes("Unauthorized") && (!req.url.includes('/authentication/refresh-token') && !req.url.includes('/login') && !req.url.includes('/logout'))) {

        if (!userService.isRefreshing) {
          return userService.refreshToken().pipe(
            switchMap(() => {
              userService.isRefreshing = false;
              userService.me().pipe(
                map((rawUser: any) => {
                  const user: User = userService.buildUser(rawUser);
                  userService.setCurrentUser(user);
                  userService.setTokenExpireTime(new Date(rawUser.exp * 1000));
                  return true;
                }));
              return next(req);
            }),
            catchError(() => {
              userService.isRefreshing = false;
              router.navigate(['/auth/login']);
              return throwError(
                () => error
              )
            }),
          )
        }
      }
      return throwError(() => error);
    }),
  );
};