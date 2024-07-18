import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable()
export class AgendaService {

    constructor(private http: HttpClient) { }

    get_agenda(data:any){
        let url = URL_SERVICIOS +"/agenda";
        return this.http.get(url);
    }

     get_persona(data:any){
      let url = URL_SERVICIOS +"/persona";
      return this.http.get(url);
    } 

    get_personas_evento(data:any){
        let url = URL_SERVICIOS +"/evento-persona";
        return this.http.get(url);
      } 

      get_sponsor(data:any){
        let url = URL_SERVICIOS +"/sponsor";
        return this.http.get(url);
      } 

      get_users(data:any){
        let url = URL_SERVICIOS +"/users/contact";
        return this.http.get(url);
      } 
}
