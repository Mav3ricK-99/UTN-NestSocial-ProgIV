import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../core/services/User/user.service';
import { catchError, map, of } from 'rxjs';
import { User } from '../../classes/user/user';

export const adminOnlyGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isUserLoggedIn() && userService.loggedInUser()?.getRole() === 'ADMIN') {
    return true;
  }

  return userService.me().pipe(
    map((rawUser: any) => {
      const user: User = userService.buildUser(rawUser);
      userService.setCurrentUser(user);
      userService.setTokenExpireTime(new Date(rawUser.exp * 1000));
      return user.getRole() === 'ADMIN' ? true : router.createUrlTree(['/feed']);
    }),
    catchError((err) => {
      console.log(err)
      return of(
        router.createUrlTree(['/auth/login'])
      );
    }),
  );
};
