import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {BreadcrumbService} from '../../breadcrumb.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../modules/auth/_services/auth.service';
import swal from 'sweetalert2'
import { AgendaService } from '../service/agenda.service';
import { Table} from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
    selector: 'evento',
    templateUrl: './evento.component.html'
})
export class EventoComponent {
    listaPersona: any = [];
    listaPersona1: any = [];
    listaPersona2: any = [];
    listaEvento: any = [];
    listaEvento1: any = [];
    evento_id: string = '';
    activa_conferencistas: boolean = false;
    activa_modera: boolean = false;
    //listaAgenda2: any = [];
    @ViewChild('dt') table: Table;


    constructor( private fb: FormBuilder,
        private authService: AuthService,
        private route: Router,
        private router: ActivatedRoute,
        private agenda: AgendaService
        ){
        
    }

    ngOnInit(): void {
        this.initForm();
        this.router.paramMap.subscribe(params => {
          this.evento_id = params.get('id');
        });
        }
        
        initForm(){
          this.cargarDatosParticipantes();
          this.cargarDatosEvento();
        }
        
        cargarDatosParticipantes(){
          this.agenda.get_personas_evento(null).subscribe((resp: any) => {
            console.log(resp);
            if(!resp.error && resp){
              console.log("Ingreso a poblar la lista");
                    this.listaPersona=resp.eventopersona;
                    this.listaPersona1=this.listaPersona.filter(p => p.eve_id==this.evento_id && p.evt_estado=="a");
                    this.listaPersona2=this.listaPersona.filter(p => p.eve_id==this.evento_id && p.evt_estado=="m");
                    if (this.listaPersona1.length>0)
                    {
                      this.activa_conferencistas=true;
                    }
                    if (this.listaPersona2.length>0)
                    {
                      this.activa_modera=true;
                    }                    
                    //this.listaAgenda2=this.listaAgenda.filter(p => p.eve_dia==2);
            }else{
              if(resp.error == 'Unauthorized'){
                console.log("Usuario no Autorizado");
              }
            }
          })
        }

        cargarDatosEvento(){
          this.agenda.get_agenda(null).subscribe((resp: any) => {
            console.log(resp);
            if(!resp.error && resp){
              console.log("Ingreso a poblar la lista");
                    this.listaEvento=resp.agenda;
                    this.listaEvento1=this.listaEvento.filter(p => p.eve_id==this.evento_id);
                    //this.listaAgenda2=this.listaAgenda.filter(p => p.eve_dia==2);
            }else{
              if(resp.error == 'Unauthorized'){
                console.log("Usuario no Autorizado");
              }
            }
          })
        }

        irAPaginaDestino(id: number) {
          this.route.navigate(['pages/participanteinfo', id]);
        }
}
