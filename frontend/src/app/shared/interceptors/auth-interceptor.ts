import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { catchError, switchMap, throwError, from } from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem("token");

  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('refresh-token')) {
        return from(authService.refreshToken()).pipe(
          switchMap((res: any) => {
            localStorage.setItem("token", res.token);

            const newClonedReq = req.clone({
              headers: req.headers.set("Authorization", `Bearer ${res.token}`)
            });
            return next(newClonedReq);
          }),
          catchError((err) => {
            authService.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
