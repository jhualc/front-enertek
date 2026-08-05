import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, catchError } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  constructor(private http: HttpClient,
    private router: Router
  ) {
  }

  store(data: any) {
    let url = URL_SERVICIOS + "/cliente";
    return this.http.post(url, data);
  }

  get(id: number) {
    let url = URL_SERVICIOS + "/cliente-sedes/cliente/" + id.toString();
    return this.http.get(url);
  }

  update(data: any) {
    let url = URL_SERVICIOS + "/cliente/" + data.cli_id;
    return this.http.put(url, data);
  }

  delete(data: any) {
    let url = URL_SERVICIOS + "/cliente/" + data.cli_id;
    return this.http.delete(url, data);
  }

  cargararchivo(data: File) {
    let url = URL_SERVICIOS + "/upload-excel";
    return this.http.post(url, data);
  }

  deleteMultiple(dataMultiple: any) {
    console.log("InsideDAta:::", dataMultiple);
    let url = URL_SERVICIOS + "/clientes/delete-multiple";

    // Debes especificar el body como parte de las opciones de la solicitud
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: dataMultiple // Aquí pasas el cuerpo (datos que quieres enviar)
    };

    return this.http.delete(url, httpOptions);
  }


}
