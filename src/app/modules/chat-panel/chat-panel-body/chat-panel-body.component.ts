import { AfterViewInit, Component, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ProfileUserService } from '../services/profile-user.service';
import { ChatPanelService } from '../_services/chat-panel.service';
import { Message } from 'primeng/api';
import { ECHO_PUSHER, URL_BACKEND, URL_FILESERVER } from 'src/app/config/config';
import { AuthService } from '../../auth/_services/auth.service';
import { CrearChatGrupalService } from '../services/crear-chat-grupal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import PerfectScrollbar from 'perfect-scrollbar';
import { MatDatepicker } from '@angular/material/datepicker';
import swal from 'sweetalert2'


@Component({
  selector: 'app-chat-panel-body',
  templateUrl: './chat-panel-body.component.html',
  styleUrls: ['./chat-panel-body.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatPanelBodyComponent implements AfterViewInit{

  @ViewChild('picker') datepicker: MatDatepicker<Date>;



  openDatepicker(): void {
    this.datepicker.open();
  }
  value: any;
  user:any;
  lado: string= '';
  mensaje: string;
  users_contacts:any =[];
  users_contacts_sponsors: any =[];
  group_contacts: any =[];
  group_id: string ='';
  groups: any[];
  path: string = URL_FILESERVER + '/storage/';
  //pathgrupo: string = URL_FILESERVER + '/storage/users/non-avatar-group.svg';
  to_user: any;
  loadChatPanelContent: boolean = false;
  loadSchedulePanelContent: boolean = false;
  chat_chat_rooms:any =[];

  step: string='';
  contador: number =0;
  users_actives:any = [];
  message_text_area:any = null;
  nombreChatGrupal:string = '';
  searchText: string = '';
  hours: any[];
  selectedHour: string;

  constructor(
              private _userProfileService: ProfileUserService,
              private _chatPanelService: ChatPanelService,
              private _crearChatGrupalService: CrearChatGrupalService,
              private route: Router,
              private router: ActivatedRoute,
              private location: Location,
              private elementRef: ElementRef
              ) { }

  ngAfterViewInit(): void {
    const container = this.elementRef.nativeElement.querySelector('.contacts-list');
    const ps = new PerfectScrollbar(container);
    container.classList.add('ps');
    this.setupEchoPusher();
  
  }
  ngOnInit(): void {

    this.setupHours();
    this.router.paramMap.subscribe(params => {
      this.group_id = params.get('id');
    }); 

    if(this.group_id){
      this.startChatGroup(Number(this.group_id));
    }
   // $("#messageInput").emojioneArea();
    this.ContactsUsers();
    this.ContactsUsersSponsor();
    this.GetGroups();
    this.user = this._chatPanelService.authServices.user;
    console.log("USERCERIBIDODOCARLD:::", this.user);

    this.listMyFriends();

    this.setupEchoPusher();
  
    }

    setupEchoPusher(): void {
      const ECHO_PUSHER_INST = ECHO_PUSHER(this._chatPanelService.authServices.token);
  
      // Escucha para refrescar salas de chat
      ECHO_PUSHER_INST.private("chat.refresh.room."+this._userProfileService.authService.user.id)
      .listen('RefreshMyChatRoom', (e:any) => {
        console.log("Mensaje en RefreshChatRoom:::::",e);
        this.chat_chat_rooms = [];
        this.chat_chat_rooms = e.chatrooms;
        this.asignedUserActive();
        this.asignedNewActive();
        this.asignedNewChat();
        this.listMyFriends();
      });
  
      // Escucha para usuarios activos
      ECHO_PUSHER_INST.join("onlineusers")
      .here((users:any) => {
        console.log(users);
        this.users_actives = users;
        this.asignedUserActive();
        this.asignedNewActive();
        this.asignedNewChat();
      }).joining((user:any) => {
        console.log(user);
        
        const found = this.users_actives.some((el: any) => el.id == user.id);
        if(!found) this.users_actives.push(user);
        this.asignedUserActive();
        this.asignedNewActive();
        this.asignedNewChat();
        // Actualiza o añade el usuario que se une
      }).leaving((user:any) => {
        console.log(user);
        const Index = this.users_actives.findIndex((item: any) => item.id == user.id);
        this.users_actives.splice(Index,1);

        const IndexInactive = this.chat_chat_rooms.findIndex((item: any) =>{
          if(item.friend_first){
            return item.friend_first.id == user.id;
          }else if (item.friend_second){
            return item.friend_second.id == user.id;
          }
          return 0;
          });
  
          if(IndexInactive != -1){
            this.chat_chat_rooms[IndexInactive].is_active = false;
          }
        // Elimina o actualiza el usuario que se va
      });
    }
  
    // Resto de tus métodos...
  

    asignedUserActive(){
      for(const user of this.users_actives){
      
        console.log("USER_CINTACT:::", this.users_actives);
        const Index = this.chat_chat_rooms.findIndex((item: any) =>{
        if(item.friend_first){
          return item.friend_first.id == user.id;
        }else if (item.friend_second){
          return item.friend_second.id == user.id;
        }
        return 0;
        });

        if(Index != -1){
          this.chat_chat_rooms[Index].is_active = true;
        }
      }
    } 

    asignedNewActive(){
      for(const user of this.users_actives){
      
        console.log("USER_CINTACTspons:::", this.users_actives);
        const Index = this.users_contacts_sponsors.findIndex((item: any) =>{
          console.log("USERS_CONTACT_SPONSORS_DATA:::", item);
          if(item.id){
            return item.id == user.id;
          }
          return 0;
        });
    
        if(Index != -1){
          this.users_contacts_sponsors[Index].is_active = true;
        }
      }
    }

    asignedNewChat(){
      for(const user of this.users_actives){
      
        console.log("USER_CINTACTspons:::", this.users_actives);
        const Index = this.users_contacts.findIndex((item: any) =>{
          console.log("USERS_CONTACT_SPONSORS_DATA:::", item);
          if(item.id){
            return item.id == user.id;
          }
          return 0;
        });
    
        if(Index != -1){
          this.users_contacts[Index].is_active = true;
          
        }
        
      }
      
    }
    
  
  irAPaginaDestino() {
    if (this.group_id)
    {
      this.route.navigate(['chat']);
    }
    else
    {
      window.location.reload();
    }
  }
  
  irAPaginaDash() {
    this.route.navigate(['dash']);
  }

  sendMessageText(){
    console.log("EL to_user::",this.to_user);

    let data= {
      

      chat_room_id: this.to_user.room_id,
      message:this.mensaje,
      to_user_id : this.to_user.user.id


    }
    if(this.mensaje){
    console.log(this.mensaje);
    this.mensaje = null;
     this._chatPanelService.sendMessageTxt(data).subscribe((resp:any) => {
      console.log(resp);
      this.setupEchoPusher();
    })
  }

   /* .subscribe((resp) =>{
      console.log(resp);
    })*/
  }

  sendMessageSponsor(mensaje, date){
    console.log("EL to_user Sponsor::",this.to_user);

    const fecha = new Date(date);

    const opcionesDate = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES');
    console.log(fechaFormateada);
        let data= {
      

      chat_room_id: this.to_user.room_id,
      message:("Hola me gustaría agendar una cita el día "+ fechaFormateada +" a las "+ mensaje + " quedo atento a tu confirmación."),
      to_user_id : this.to_user.user.id


    }
    if(mensaje){
    console.log(mensaje);
    mensaje = null;
     this._chatPanelService.sendMessageTxt(data).subscribe((resp:any) => {
      console.log(resp);
     
    })
    swal.fire({
      title: 'Agendado!',
      text: 'El mensaje de solicitud de agendamiento fue enviado satisfactoriamente, puede validarlo en los chats activos.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#86B444'
    }).then((result) => {
      if (result.value) {
        setTimeout(() => {
          this.irAPaginaDestino();
        }, 500); // Espera 2000 milisegundos (2 segundos) antes de la redirección
      }
    });
    
  }

  
  }

    ContactsUsers(){
    
      this._userProfileService.ContactUsers().subscribe((resp: any) => {
        console.log("contactUser",resp);
          this.users_contacts = resp.users;
      })
    }

    ContactsUsersSponsor(){
    
      this._userProfileService.ContactUsersSponsor().subscribe((resp: any) => {
        console.log("userSponsor",resp);
                this.users_contacts_sponsors = resp.users;
      })
    }
    
    GetGroups(){
    
      this._chatPanelService.listMyGroups()
        .subscribe((response: any) =>{
          console.log(response);
          this.groups = response.grupo;
        })
    
    }

    startChat(value: number){

      let data = {
        to_user_id: value,
      }

      this.loadChatPanelContent = false;
      this._chatPanelService.startChat(data).subscribe((resp:any) => {
      
        console.log(resp);
        this.loadChatPanelContent = true;
      
        $("#startConversation").modal("hide");
        $("#chatActivos").modal("hide");
        $("#startGroup").modal("hide");
        $("#startConversationSponsor").modal("hide")
        this.to_user = resp;
      })
    }

    startChatSchedule(value: number){

      console.log("Inside StartChatSchedule");
      let data = {
        to_user_id: value,
      }

      this.loadSchedulePanelContent = false;
      this._chatPanelService.startChat(data).subscribe((resp:any) => {
      
        console.log(resp);
        this.loadSchedulePanelContent = true;

        $("#startConversation").modal("hide");
        $("#chatActivos").modal("hide");
        $("#startGroup").modal("hide");
        $("#startConversationSponsor").modal("hide")
        this.to_user = resp;
      })
    }

    startChatGroup(value: number){

      let data = {
        to_user_id: value,
      }

      this.loadChatPanelContent = false;
      this._chatPanelService.startChatGroup(data).subscribe((resp:any) => {
      
        console.log(resp);
        this.loadChatPanelContent = true;

        $("#participarGrupo").modal("hide");
        $("#startConversation").modal("hide");

        $("#chatActivos").modal("hide");
        $("#startGroup").modal("hide");
        $("#iniciarGroup").modal("hide");

        


        this.to_user = resp;
      })
    }

    listMyFriends(){
      
      this._chatPanelService.listMyChatRooms({}).subscribe((resp: any)=>{
      
        console.log("larespuesta::",resp);
        this.chat_chat_rooms = resp.chatrooms;
      }
        
      )
      this.setupEchoPusher();
    }

    loadMyChat(item: any){
      let to_user_id = 0;
      item.count_message =0;
      if(item.friend_first){
        to_user_id = item.friend_first.id;
        }else if(item.friend_second){
          to_user_id = item.friend_second.id;
        }else{
          to_user_id = item.group_chat.id;
        }
        item.is_chat_Active = true;
        this.chat_chat_rooms.map((element:any)=>{
          if(element.uniqd != item.uniqd){
            element.is_chat_active = false;
          }
          return element;
        })
      this.startChat(to_user_id);
    }

    createGroup(){

     
      console.log("grupo creado", this.nombreChatGrupal, "::desoues del nombre");
      this.contador++;
      if(this.contador == 1){
        console.log("el item en cero", this.contador);
        let data = {
          nombreGrupo: this.nombreChatGrupal,
        }
  
        this._crearChatGrupalService.CreateGroupChat(data)
          .subscribe((resp:any) => {
            console.log("larespuesta::",resp);
          })
      }

      if(this.contador == 2){
        console.log("Ahora si se crea");
      //  this.contador=0; //
      this.listMyFriends();
      }
    }

    hideModal(){
      $("#startConversation").modal("hide");
      $("#chatActivos").modal("hide");
      $("#startGroup").modal("hide");
     
      this.GetGroups();
    }
    setupHours() {
      this.hours = [];
      for (let i = 7; i < 19; i++) {
        let hourString = i < 10 ? `0${i}` : `${i}`;
        this.hours.push({ label: `${hourString}:00`, value: `${hourString}:00` });
        this.hours.push({ label: `${hourString}:30`, value: `${hourString}:30` });
      }
    }

    agendarCita(hours, value ){
      console.log("INgreso agendarCita", hours, "FEcha", value);
    }
  
}
