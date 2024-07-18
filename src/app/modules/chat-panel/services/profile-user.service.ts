import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/_services/auth.service';
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ProfileUserService {

  constructor(
      public http: HttpClient,
      public authService: AuthService,
    ) { }

    
    ContactUsers(){
      console.log("autorizaciobn::"+ this.authService.token);
      let headers =  new HttpHeaders({'Authorization': 'Bearer'+ this.authService.token});
      let LINK = URL_SERVICIOS+"/users/contact";
      return this.http.get(LINK,{ headers: headers});
    }

    ContactUsersSponsor(){
      console.log("autorizaciobn::"+ this.authService.token);
      let headers =  new HttpHeaders({'Authorization': 'Bearer'+ this.authService.token});
      let LINK = URL_SERVICIOS+"/users/sponsors";
      return this.http.get(LINK,{ headers: headers});
    }

    AvatarChangeUser(file:any){
      let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authService.token})
      let LINK = URL_SERVICIOS+"/profile-user";
      let formData = new FormData();
      formData.append("imagen",file,file.name);
      return this.http.post(LINK,formData,{headers: headers});
    }
  // heco
}
 