import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/_services/auth.service';
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ChatPanelService {

  constructor(
    public http: HttpClient,
    public authServices: AuthService,
  ) { }
  startChat(data:any){
    let headers = new HttpHeaders({'Authorization': "Bearer "+this.authServices.token});
    let URL = URL_SERVICIOS+ "/chat/start-chat";
    return this.http.post(URL,data,{headers: headers});
  }

  startChatGroup(data:any){
    let headers = new HttpHeaders({'Authorization': "Bearer "+this.authServices.token});
    let URL = URL_SERVICIOS+ "/chat/start-chat-group";
    return this.http.post(URL,data,{headers: headers});
  }

  listMyChatRooms(data:any){
    let headers = new HttpHeaders({'Authorization': "Bearer "+this.authServices.token});
    let URL = URL_SERVICIOS+ "/chat/list-my-chat-room";
    return this.http.post(URL,data,{headers: headers});
  }
  paginateScroll(page:any,data:any){
    let headers = new HttpHeaders({'Authorization': "Bearer "+this.authServices.token});
    let URL = URL_SERVICIOS+ "/chat/chat-room-paginate?page="+page;
    return this.http.post(URL,data,{headers: headers});
  }


  listMyGroups(){
  
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authServices.token});
    let URL = URL_SERVICIOS+ "/grupo";
    return this.http.get(URL,  {headers:headers});
  }
  sendMessageTxt(data:any){
    let headers = new HttpHeaders({'Authorization': "Bearer "+this.authServices.token});
    let URL = URL_SERVICIOS+ "/chat/send-message-txt";
    return this.http.post(URL,data,{headers: headers});
  }
}
