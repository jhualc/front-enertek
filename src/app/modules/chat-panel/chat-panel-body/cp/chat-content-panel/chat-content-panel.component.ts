import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ECHO_PUSHER, URL_FILESERVER } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { ChatPanelService } from '../../../_services/chat-panel.service';

declare var $:any;
@Component({
  selector: 'app-chat-content-panel',
  templateUrl: './chat-content-panel.component.html',
  styleUrls: ['./chat-content-panel.component.css']

})
export class ChatContentPanelComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  //  this.user = this.authService.getUser(); // Obtener el usuario autenticado
  //  console.log('Usuario autenticado:', this.user);
  }
}
