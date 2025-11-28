import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { inject } from '@angular/core';

export const guestGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!authService.isLoggedIn()) return true;

  return false;
};
