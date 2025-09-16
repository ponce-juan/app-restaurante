import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorAuthorizationHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req)
    .pipe(
      catchError ((error: HttpErrorResponse) => {
        let errorMsg = "";
        if( error.error instanceof ErrorEvent ){
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = `Error Code: ${error.status}, Message: ${error.message}`;
        }
        return throwError(() => errorMsg);

      })
    );
};
