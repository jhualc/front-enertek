import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, catchError } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {



  constructor( private http: HttpClient,
                private router: Router
                ) { 
                }

  store(data:any){
    
    let url = URL_SERVICIOS +"/marcas";
    return this.http.post(url, data);
      
  }

}
