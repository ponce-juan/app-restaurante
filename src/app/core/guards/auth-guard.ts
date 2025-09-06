import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanMatchFn = (route, segments) => {
  return inject(AuthService).currentUser$.pipe(
    map( user => {
      if (user) {
        return true;
      } 
        // Optionally, redirect to login page
        return false;
    })
  );
};
