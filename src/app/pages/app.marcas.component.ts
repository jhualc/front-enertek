import {Component, OnInit} from '@angular/core';
import {Marca} from '../demo/domain/marca';
import { MarcaService } from '../../app/demo/service/marca.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from '../breadcrumb.service';
import {Table} from 'primeng/table';

@Component({
    templateUrl: './app.marcas.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../assets/demo/badges.scss']
})
export class AppMarcasComponent implements OnInit {

    dataDialog: boolean = false;

    deleteDataDialog: boolean = false;

    deleteRowsDialog: boolean = false;

    marcas: Marca[] = [];

    marca: Marca = {};

    selectedMarcas: Marca[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    
    carga: boolean = true;

    constructor(private marcaservice: MarcaService, private messageService: MessageService,
                private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Administracion' },
            { label: 'Marcas', routerLink: ['/pages/marcas'] }
        ]);
    }
 
    ngOnInit() {
        //this.productService.getProducts().then(data => this.products = data);
        this.loadData();
    }

    loadData(){
        this.carga = true;
        this.marcaservice.get(null).subscribe((resp: any) => {
          console.log(resp);
          if(!resp.error && resp){
                  this.marcas=resp.marca;
                  this.carga = false;
          }else{
            if(resp.error == 'Unauthorized'){
              console.log("Usuario no Autorizado");
            }
          }
        })

      }

    openNew() {
        this.marca = {};
        this.submitted = false;
        this.dataDialog = true;
    }

    deleteSelectedRows() {
        this.deleteRowsDialog = true;
    }

    editData(marca: Marca) {
        this.marca = { ...marca };
        this.dataDialog = true;
    }

    deleteData(marca: Marca) {
        this.deleteDataDialog = true;
        this.marca = { ...marca };
    }

    confirmDeleteSelected() {
        this.deleteRowsDialog = false;
        this.marcaservice.deleteMultiple(this.selectedMarcas)
        .subscribe((resp: any) => {
          console.log(resp);
          this.deleteRowsDialog = false;
          if(!resp.error && resp){
            this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
            this.loadData();
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
          }
        }) 
        this.marcas = [];
    }

    confirmDelete() {
        this.deleteDataDialog = false;
        this.marcaservice.delete(this.marca)
        .subscribe((resp: any) => {
          console.log(resp);
          this.deleteDataDialog = false;
          if(!resp.error && resp){
            this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
            this.loadData();
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
          }
        }) 
        this.marca = {};
    }

    hideDialog() {
        this.dataDialog = false;
        this.submitted = false;
        this.marca = {};
        this.loadData();
    }

    saveData() {
        this.submitted = true;
        if (this.marca.mar_id) {
            this.marcaservice.update(this.marca)
            .subscribe((resp: any) => {
              console.log(resp);
              if(!resp.error && resp){
                this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                this.dataDialog = false;
                this.loadData();
              }else{
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
              }
            }) 
        }
        else
        {
            this.marcaservice.store(this.marca)
            .subscribe((resp: any) => {
              console.log(resp);
              if(!resp.error && resp){
                this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                this.marca = {};
              }else{
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
              }
            })            
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}