import Echo from "laravel-echo"
import { environment } from "src/environments/environment";


export const URL_BACKEND = environment.URL_BACKEND;
export const URL_SERVICIOS = environment.URL_SERVICIOS;
export const URL_FRONTEND   = environment.URL_FRONTEND;
export const URL_FILESERVER   = environment.URL_FILESERVER;

export function ECHO_PUSHER (token:any){
    return new Echo ({
        broadcaster: 'pusher',
        encrypted: environment.production,
        cluster: 'mt1',
        key: 'ASDEFGRG1231',
        wsHost: environment.HOST_BACKEND,
        wsPort: environment.WSS_PORT,
        wssPort: 443,
        forceTLS: environment.SSL_WSS,
        disableStats: true,
        //enabledTransports: ['ws'],
        authEndpoint: `${URL_SERVICIOS}/broadcasting/auth`,
        auth: {
          headers: {Authorization:`Bearer ${token}`}
          
        },
      });
  }
   