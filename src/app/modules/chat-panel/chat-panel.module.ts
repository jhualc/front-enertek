import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatPanelRoutingModule } from './chat-panel-routing.module';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [


    // ... cualquier otro componente que necesite el datepicker
  ],
  imports: [
    CommonModule,
    ChatPanelRoutingModule,
    ButtonModule
  ],
  providers: [
    // Configura el locale del datepicker si es necesario
   
    // ... cualquier otro proveedor que necesites
  ]
})
export class ChatPanelModule { }
