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
    selector: 'agenda',
    templateUrl: './agenda.component.html'
})
export class AgendaComponent {
    listaAgenda: any = [];
    listaAgenda1: any = [];
    listaAgenda2: any = [];
    agenda_id: string = '';
    dia: string = '';
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
          this.agenda_id = params.get('id');
          if (this.agenda_id=='1')
          {
           this.dia='Día 1 - Martes 9 de abril';
           this.cargarDatosAgenda();
          }
          else if (this.agenda_id=='2')
          {
           this.dia='Día 2 - Miércoles 10 de abril';
           this.cargarDatosAgenda();
          }
          else if (this.agenda_id=='3')
          {
           this.dia='Día 3 - Jueves 11 de abril';
           this.cargarDatosAgenda();
          }
        });
      }
        
        initForm(){
          this.cargarDatosAgenda();
        }
        
        cargarDatosAgenda(){
          this.agenda.get_agenda(null).subscribe((resp: any) => {
            console.log(resp);
            if(!resp.error && resp){
              console.log("Ingreso a poblar la lista");
                    this.listaAgenda=resp.agenda;
                    this.listaAgenda1=this.listaAgenda.filter(p => p.eve_dia==this.agenda_id && p.eve_tipo!="Cápsula");
                    this.listaAgenda2=this.listaAgenda.filter(p => p.eve_dia==this.agenda_id && p.eve_tipo=="Cápsula");
            }else{
              if(resp.error == 'Unauthorized'){
                console.log("Usuario no Autorizado");
              }
            }
          })
        }

        irAPaginaDestino(id: number) {
          this.route.navigate(['pages/evento', id]);
        } 
}
