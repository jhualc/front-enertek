import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPanelBodyComponent } from './chat-panel-body/chat-panel-body.component';
import { ChatPanelComponent } from './chat-panel.component';

const routes: Routes = [

  {
    path: '',
    component: ChatPanelBodyComponent,
    children:[
     
      {
        path: '', redirectTo: 'chat-content', pathMatch: 'full'
      },
      {
        path: '**', redirectTo: 'chat-content', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatPanelRoutingModule { }
