import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

export const authorizationHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
    
  if(token){

    if(isTokenExpired(token)){
      authService.clearTokens();
      router.navigate(['/login']);
      return throwError( () => new Error("Token expired, redirecting to login."))
    }

    const newReq = req.clone({
      headers: req.headers
                .set('Authorization', token)
                .set('Content-Type', 'application/json')
    })
    return next(newReq);
  }

  //Si no existe token, se redirecciona a login
  if(!req.url.includes('/login') && !req.url.includes('/register')){
    router.navigate(['/login']);
    return throwError(() => new Error("No token available, redirecting to login"));
  }
  
  return next(req);
  
};

function isTokenExpired(token: string): boolean {
  try{
    const payload = JSON.parse(atob(token.split('.')[1])); //Extraigo el payload del jwt
    const exp = payload.exp * 1000;
    const now = Date.now();

    return now >= exp;
  }catch (e) {
    //Si no se pudo decodificar el token, lo considero expirado
    return true;
  }
}
