import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth/_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CrearChatGrupalService {

 
  constructor(
      public http: HttpClient,
      public authService: AuthService,
    ) { }

    
    CreateGroupChat(data:any){
      console.log("los datos del crear grupo::"+ data);
      let headers =  new HttpHeaders({'Authorization': 'Bearer'+ this.authService.token});
      let LINK = URL_SERVICIOS+"/chat-grupal";
      return this.http.post(LINK,data, { headers: headers});
    }
}
