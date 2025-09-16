import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  //Obtengo roles permitidos
  const roles = route.data?.['roles'] as string[];

  //Obtengo rol del usuario
  const authService = inject(AuthService);
  const userRole = authService.getRole();

  //Verifico si el rol del usuario está entre los roles permitidos
  if (roles && roles.length > 0) {
    if (!userRole || !roles.includes(userRole)) {
      console.warn('Access denied - You do not have permission to access this page');
      return false;
    }
  }

  //Si el rol del usuario es válido, permito el acceso
    return true;
};

