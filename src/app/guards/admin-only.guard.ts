import { CanActivateFn } from '@angular/router';

export const adminOnlyGuard: CanActivateFn = (route, state) => {
  return true;
};
