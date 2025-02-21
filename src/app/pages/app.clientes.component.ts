import {Component, OnInit} from '@angular/core';
import {Cliente} from '../demo/domain/cliente';
import {ClienteService } from '../demo/service/cliente.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from '../breadcrumb.service';
import {Table} from 'primeng/table';
import {TipoIdentificacion } from '../demo/domain/tipo.identificacion';
import { URL_SERVICIOS } from '../config/config';

@Component({
    templateUrl: './app.clientes.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../assets/demo/badges.scss']
})
export class AppClientesComponent implements OnInit {

    dataDialog: boolean = false;

    dataCargar: boolean = false;

    deleteDataDialog: boolean = false;

    deleteRowsDialog: boolean = false;

    clientes: Cliente[] = [];

    cliente: Cliente = {};

    selectedRows: Cliente[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    
    carga: boolean = true;

    urlsubirarchivo: string = '';

    tiposId: TipoIdentificacion[] = [
      {tipid_id: 'CC', tipid_descripcion: 'CC'},
      {tipid_id: 'CE', tipid_descripcion: 'CE'},
      {tipid_id: 'NIT', tipid_descripcion: 'NIT'},
      // más elementos aquí
    ];

    constructor(private clienteservice: ClienteService, private messageService: MessageService,
                private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Administracion' },
            { label: 'Clientes', routerLink: ['/pages/clientes'] }
        ]);
    }
 
    ngOnInit() {
        //this.productService.getProducts().then(data => this.products = data);
        this.urlsubirarchivo=URL_SERVICIOS + '/upload-excel';
        this.loadData();
    }

    loadData(){
        this.carga = true;
        this.clienteservice.get(null).subscribe((resp: any) => {
          console.log(resp);
          if(!resp.error && resp){
                  this.clientes=resp.cliente;
                  this.carga = false;
          }else{
            if(resp.error == 'Unauthorized'){
              console.log("Usuario no Autorizado");
            }
          }
        })

      }

    openNew() {
        this.cliente = {};
        this.submitted = false;
        this.dataDialog = true;
    }

    openCargar() {
      this.cliente = {};
      this.submitted = false;
      this.dataCargar = true;
  }

    deleteSelectedRows() {
        this.deleteRowsDialog = true;
    }

    editData(cliente: Cliente) {
        this.cliente = { ...cliente };
        this.dataDialog = true;
    }

    deleteData(cliente: Cliente) {
        this.deleteDataDialog = true;
        this.cliente = { ...cliente };
    }

    confirmDeleteSelected() {
        this.deleteRowsDialog = false;
        console.log(this.selectedRows);
        this.clienteservice.deleteMultiple(this.selectedRows)
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
        this.clienteservice.delete(this.cliente)
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
        this.cliente = {};
    }

    hideDialog() {
        this.dataDialog = false;
        this.dataCargar = false;
        this.submitted = false;
        this.cliente = {};
        this.loadData();
    }

    saveData() {
        this.submitted = true;
        if (this.cliente.cli_id) {
            this.clienteservice.update(this.cliente)
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
            this.clienteservice.store(this.cliente)
            .subscribe((resp: any) => {
              console.log(resp);
              if(!resp.error && resp){
                this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                this.cliente = {};
              }else{
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
              }
            })            
        }
    }

    onUpload(event: any) {
      this.messageService.add({severity: 'success', summary: 'Exitoso!', detail: event.originalEvent.body.message, life: 3000});
      this.hideDialog();
  }

  onError(event: any) {
    this.messageService.add({ severity: 'error', summary: 'Error!', detail: event.error.message, life: 3000 });
  }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}