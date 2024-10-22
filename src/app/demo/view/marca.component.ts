import {Component} from '@angular/core';
import {BreadcrumbService} from '../../breadcrumb.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarcaService } from '../service/marca.service';
import swal from 'sweetalert2'

@Component({
    selector: 'marca',
    templateUrl: './marca.component.html'
})
export class MarcaComponent {
    marcaForm: FormGroup;
    get descripcion() { return this.marcaForm.get('descripcion'); };
  
    hasError: Boolean= false;
    hasErrorText: any = '';
    dark: boolean;
    checked: boolean;
    
    constructor( private fb: FormBuilder,
        private marcaService: MarcaService,
        private route: Router,
        private router: ActivatedRoute){
        
    }

    ngOnInit(): void {
        this.initForm();
        }
        
        initForm(){
         this.marcaForm = this.fb.group({
            descripcion:[null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          }) 
        }
        
        submit(){
          this.hasError= false;
        //  console.log(this.loginForm.value);
        const data = {
          mar_descripcion: this.marcaForm.value.descripcion,
        }
        
           this.marcaService.store(data)
             .subscribe((resp: any) => {
               console.log(resp);
               if(!resp.error && resp){
                 swal.fire({
                   title: 'Marca!', 
                   text: 'La marca se ha registrado correctamente.', 
                   icon: 'success',
                   confirmButtonText: 'Aceptar',
                   confirmButtonColor: '#86B444'
                 });
                 this.marcaForm.reset();
               }else{
                   swal.fire({
                     title: 'Marca!',
                     text: resp.error[0], 
                     icon: 'error',
                     confirmButtonText: 'Aceptar',
                     confirmButtonColor: '#4F91CE'
                   });
                  
               }
             })
          }

}
