import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Grab the token from storage
  const token = localStorage.getItem('token');

  // 2. If it exists, "clone" the request and add the Header
  // (We clone because the original request is immutable)
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Pass the request (modified or not) to the next step
  return next(req);
};