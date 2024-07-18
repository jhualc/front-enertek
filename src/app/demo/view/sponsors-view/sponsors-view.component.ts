import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../modules/auth/_services/auth.service';
import { Table} from 'primeng/table';
import { AgendaService } from '../../service/agenda.service';



@Component({
  selector: 'app-sponsors-view',
  templateUrl: './sponsors-view.component.html',
  styleUrls: ['./sponsors-view.component.scss']
})
export class SponsorsViewComponent {
  listaSponsors: any = [];
  listaInfo: any = [];
  spo_id: string = '';

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
        this.cargarDatosSponsors(this.id);
        this.router.paramMap.subscribe(params => {
          this.spo_id = params.get('id');
        });
      }
      
      cargarDatosSponsors(id: string){
        this.agenda.get_sponsor(id).subscribe((resp: any) => {
          console.log("SponsorInof",resp);
          if(!resp.error && resp){
            
                  this.listaSponsors=resp.sponsor;
                  this.listaInfo=this.listaSponsors.filter(p => p.spo_id==id);
                  console.log("Ingreso a poblar la lista", this.listaInfo);
                  //this.listaAgenda2=this.listaAgenda.filter(p => p.eve_dia==2);
          }else{
            if(resp.error == 'Unauthorized'){
              console.log("Usuario no Autorizado");
            }
          }
        })
      }
}
