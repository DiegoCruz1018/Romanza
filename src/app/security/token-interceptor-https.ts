import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { SecurityService } from "./security.service";

//Este interceptor va a interceptar todas las peticiones Http que hagamos
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
) => {
    //Esta función de aquí se ejecutará cada vez que hagamos una petición Http
    //Lo que haremos es anexarle el token a cada petición
    
    //Necesitamos seguridadService para obtener el token
    const securityService = inject(SecurityService)
    const token = securityService.getToken();

    if(token){
        req = req.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    return next(req);
}