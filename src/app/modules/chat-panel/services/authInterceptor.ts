import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError  } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor ( private authService: AuthService, 
                  private router: Router) {}  


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    
        //console.log("Entro al interceptor");
        let authReq = req;
        const token = this.authService.getToken();

         //console.log("Entro al interceptor el token:::"+ token);
        if(token != null){

            //console.log("el bearere:::"+ token);
            authReq = authReq.clone({
            
                
                setHeaders : {Authorization:`Bearer ${token}`}
            })
        }
        return next.handle(authReq).pipe(catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {

                this.authService.logout(); 
              
            }
            return throwError(error);
        }));
    }
}

export const authInterceptorProviders = [

    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }
]