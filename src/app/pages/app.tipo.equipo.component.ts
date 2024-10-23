import {Component, OnInit} from '@angular/core';
import {TipoEquipo} from '../demo/domain/tipo.equipo';
import {TipoEquipoService } from '../demo/service/tipo.equipo.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from '../breadcrumb.service';
import {Table} from 'primeng/table';

@Component({
    templateUrl: './app.tipo.equipo.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../assets/demo/badges.scss']
})
export class AppTipoEquipoComponent implements OnInit {

    dataDialog: boolean = false;

    deleteDataDialog: boolean = false;

    deleteRowsDialog: boolean = false;

    tiposequipo: TipoEquipo[] = [];

    tipoequipo: TipoEquipo = {};

    selectedRows: TipoEquipo[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    
    carga: boolean = true;

    constructor(private tipoequiposervice: TipoEquipoService, private messageService: MessageService,
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
        this.tipoequiposervice.get(null).subscribe((resp: any) => {
          console.log(resp);
          if(!resp.error && resp){
                  this.tiposequipo=resp.tipo_equipo;
                  this.carga = false;
          }else{
            if(resp.error == 'Unauthorized'){
              console.log("Usuario no Autorizado");
            }
          }
        })

      }

    openNew() {
        this.tipoequipo = {};
        this.submitted = false;
        this.dataDialog = true;
    }

    deleteSelectedRows() {
        this.deleteRowsDialog = true;
    }

    editData(tipoequipo: TipoEquipo) {
        this.tipoequipo = { ...tipoequipo };
        this.dataDialog = true;
    }

    deleteData(tipoequipo: TipoEquipo) {
        this.deleteDataDialog = true;
        this.tipoequipo = { ...tipoequipo };
    }

    confirmDeleteSelected() {
        this.deleteRowsDialog = false;
        console.log(this.selectedRows);
        this.tipoequiposervice.deleteMultiple(this.selectedRows)
        .subscribe((resp: any) => {
          console.log(resp);
          this.deleteRowsDialog = false;
          if(!resp.error && resp){
            this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
            this.loadData();
            this.selectedRows = [];
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
          }
        }) 
    }

    confirmDelete() {
        this.deleteDataDialog = false;
        this.tipoequiposervice.delete(this.tipoequipo)
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
        this.tipoequipo = {};
    }

    hideDialog() {
        this.dataDialog = false;
        this.submitted = false;
        this.tipoequipo = {};
        this.loadData();
    }

    saveData() {
        this.submitted = true;
        if (this.tipoequipo.teq_id) {
            this.tipoequiposervice.update(this.tipoequipo)
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
            this.tipoequiposervice.store(this.tipoequipo)
            .subscribe((resp: any) => {
              console.log(resp);
              if(!resp.error && resp){
                this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                this.tipoequipo = {};
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