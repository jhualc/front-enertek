import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, catchError } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token:any = '';
  user:any = null;
  id: any = null;

  constructor( private http: HttpClient,
                private router: Router
                ) { 
                  
                  this.loadLocalStorage();                
                }

  loadLocalStorage(){
  
    if(localStorage.getItem("token") && localStorage.getItem("user")){
    
      this.token = localStorage.getItem("token");
      this.user = JSON.parse(localStorage.getItem("user") ?? '');

      console.log("Usuario del sTAorage:::", this.user);
    }else{
    
      this.token='';
      this.user=null;
    }
  }
  
  login(email:string, password: string){
  
    let url = URL_SERVICIOS+'/login';

    return this.http.post(url, {email, password}).pipe(
      
        map( (auth:any) =>{
          if(auth.access_token){
            return this.storeLocalStorageToken(auth);
          }else{
            return of(undefined);
          }
        }), 
        catchError(error => {

          console.log(error);
          return of(error);
          
        })
      )
  }



  storeLocalStorageToken(auth: any){

    if(auth.access_token){
      localStorage.setItem("token", auth.access_token);
      localStorage.setItem("user",  JSON.stringify( auth.user));
      localStorage.setItem("id",  JSON.stringify( auth.id))
      this.token = auth.access_token;
      this.user = auth.user;
      this.id= auth.id;
      return true;
    }else{
      return false;
    }
  
  }

  register(data:any){
    
    let url = URL_SERVICIOS +"/register";
    return this.http.post(url, data);
      
  }

  logout(){
    
    this.token='';
    this.user=null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(['/login'],{
      queryParams: {}
    });
  }

  isLogin(){
    return localStorage.getItem("token") !== null;
  }

  public getToken(): string | null {
   
    return localStorage.getItem("token");
}
}
