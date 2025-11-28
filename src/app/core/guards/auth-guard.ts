import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanMatchFn = (route, segments) => {

  const router = inject(Router);

  return inject(AuthService).currentUser$.pipe(
    map( (user) => {
      if(user){
        return true;
      }
      return router.createUrlTree(['/login']);
    }

    )
  );
};
