import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token"); // Sacamos la llave

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // La pegamos en el encabezado
      }
    });
    return next(cloned);
  }

  return next(req);
};