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
    selector: 'participanteinfo',
    templateUrl: './participanteinfo.component.html'
})
export class ParticipanteInfoComponent {
    listaPersona: any = [];
    listaInfo: any = [];
    per_id: string = '';
    //listaAgenda2: any = [];
    @ViewChild('dt') table: Table;
    id: string='';


    constructor( private fb: FormBuilder,
        private authService: AuthService,
        private route: Router,
        private router: ActivatedRoute,
        private agenda: AgendaService
        ){

          this.id =this.router.snapshot.paramMap.get('id');
        
    }

    ngOnInit(): void {
        this.initForm();
        }
        
        initForm(){
          this.cargarDatosParticipantes();
          this.router.paramMap.subscribe(params => {
            this.per_id = params.get('id');
          });
        }
        
        cargarDatosParticipantes(){
          this.agenda.get_persona(null).subscribe((resp: any) => {
            console.log(resp);
            if(!resp.error && resp){
              console.log("Ingreso a poblar la lista");
                    this.listaPersona=resp.persona;
                    this.listaInfo=this.listaPersona.filter(p => p.per_id==this.per_id);
                    //this.listaAgenda2=this.listaAgenda.filter(p => p.eve_dia==2);
            }else{
              if(resp.error == 'Unauthorized'){
                console.log("Usuario no Autorizado");
              }
            }
          })
        }
}
