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
    selector: 'participantes',
    templateUrl: './participantes.component.html'
})
export class ParticipantesComponent {
    listaPersona: any = [];
    //listaAgenda1: any = [];
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
        }
        
        initForm(){
          this.cargarDatosParticipantes();
        }
        
        cargarDatosParticipantes(){
          this.agenda.get_persona(null).subscribe((resp: any) => {
            console.log(resp);
            if(!resp.error && resp){
              console.log("Ingreso a poblar la lista");
                    this.listaPersona=resp.persona.filter(p => p.per_tipo_persona==1);
                    //this.listaAgenda1=this.listaAgenda.filter(p => p.eve_dia==1);
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
