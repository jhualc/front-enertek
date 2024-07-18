import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  
  constructor (
    private authService: AuthService,
    private router: Router
){}
canActivate(
route: ActivatedRouteSnapshot,
state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

if(!this.authService.isLogin()){
this.router.navigate(["/login"]);
return false;
}

let token =this.authService.token;
let expirado = (JSON.parse(atob(token.split('.')[1]))).exp;
if(Math.floor((new Date).getTime() / 1000)>= expirado){

this.authService.logout();
return false;
}
return true;

}

}
