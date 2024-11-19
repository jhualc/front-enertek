import {Component, OnInit} from '@angular/core';
import {Equipo} from '../demo/domain/equipo';
import {Marca} from '../demo/domain/marca';
import {TipoEquipo} from '../demo/domain/tipo.equipo';
import {EquipoService } from '../demo/service/equipo.service';
import {MarcaService } from '../demo/service/marca.service';
import {TipoEquipoService } from '../demo/service/tipo.equipo.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from '../breadcrumb.service';
import {Table} from 'primeng/table';

@Component({
    templateUrl: './app.baterias.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../assets/demo/badges.scss']
})
export class AppBateriasComponent implements OnInit {

    dataDialog: boolean = false;

    deleteDataDialog: boolean = false;

    deleteRowsDialog: boolean = false;

    marcas: Marca[] = [];

    tiposequipo: TipoEquipo[] = [];

    equipos: Equipo[] = [];

    equipo: Equipo = {};

    selectedRows: Equipo[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    
    carga: boolean = true;

    constructor(private equiposervice: EquipoService, private marcaservice: MarcaService, private tiposequiposervice: TipoEquipoService, private messageService: MessageService,
                private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Administracion' },
            { label: 'Equipos', routerLink: ['/pages/equipos'] }
        ]);
    }
 
    ngOnInit() {
        //this.productService.getProducts().then(data => this.products = data);
        this.loadData();
    }

    loadDataMarcas(){
      this.marcaservice.get(null).subscribe((resp: any) => {
        console.log(resp);
        if(!resp.error && resp){
                this.marcas=resp.marca;
        }else{
          if(resp.error == 'Unauthorized'){
            console.log("Usuario no Autorizado");
          }
        }
      })
    }

    loadDataTiposEquipo(){
      this.tiposequiposervice.get(null).subscribe((resp: any) => {
        console.log(resp);
        if(!resp.error && resp){
                this.tiposequipo=resp.tipo_equipo;
        }else{
          if(resp.error == 'Unauthorized'){
            console.log("Usuario no Autorizado");
          }
        }
      })
    }

    loadData(){
        this.carga = true;
        this.loadDataMarcas();
        this.loadDataTiposEquipo();
        this.equiposervice.get(null).subscribe((resp: any) => {
          console.log(resp);
          if(!resp.error && resp){
                  this.equipos=resp.equipo;
                  // "Join" de los dos arrays basados en la clave 'mar_id'
                /*  const joinedData = this.equipos.map(equipo => {
                    const marca = this.marcas.find(g => g.mar_id === equipo.mar_id);
                    const tipoequipo = this.tiposequipo.find(g => g.teq_id === equipo.teq_id);
                    return {
                      ...equipo,
                      marca: marca ? marca.mar_descripcion : 'Sin marca', // si no hay marca, asigna 'Sin marca'
                      tipoequipo: tipoequipo ? tipoequipo.teq_descripcion : 'Sin tipo'
                    };
                  });
                  this.equipos=joinedData; 
                */
                  this.carga = false;
          }else{
            if(resp.error == 'Unauthorized'){
              console.log("Usuario no Autorizado");
            }
          }
        })

      }

    openNew() {
        this.equipo = {};
        this.submitted = false;
        this.dataDialog = true;
    }

    deleteSelectedRows() {
        this.deleteRowsDialog = true;
    }

    editData(equipo: Equipo) {
        this.equipo = { ...equipo };
        this.dataDialog = true;
    }

    deleteData(equipo: Equipo) {
        this.deleteDataDialog = true;
        this.equipo = { ...equipo };
    }

    confirmDeleteSelected() {
        this.deleteRowsDialog = false;
        console.log(this.selectedRows);
        this.equiposervice.deleteMultiple(this.selectedRows)
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
        this.equiposervice.delete(this.equipo)
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
        this.equipo = {};
    }

    hideDialog() {
        this.dataDialog = false;
        this.submitted = false;
        this.equipo = {};
        this.loadData();
    }

    saveData() {
        this.submitted = true;
        if (this.equipo.equ_id) {
            this.equiposervice.update(this.equipo)
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
            this.equiposervice.store(this.equipo)
            .subscribe((resp: any) => {
              console.log(resp);
              if(!resp.error && resp){
                this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                this.equipo = {};
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