import {Component, OnInit} from '@angular/core';
import {Bateria} from '../demo/domain/bateria';
import {Marca} from '../demo/domain/marca';
import {BateriaService } from '../demo/service/bateria.service';
import {MarcaService } from '../demo/service/marca.service';
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

    baterias: Bateria[] = [];

    bateria: Bateria = {};

    selectedRows: Bateria[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    
    carga: boolean = true;

    constructor(private bateriaservice: BateriaService, private marcaservice: MarcaService,  private messageService: MessageService,
                private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Administracion' },
            { label: 'Baterías', routerLink: ['/pages/baterias'] }
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

    loadData(){
        this.carga = true;
        this.loadDataMarcas();
        this.bateriaservice.get(null).subscribe((resp: any) => {
          console.log(resp);
          if(!resp.error && resp){
                  this.baterias=resp.bateria;
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
        this.bateria = {};
        this.submitted = false;
        this.dataDialog = true;
    }

    deleteSelectedRows() {
        this.deleteRowsDialog = true;
    }

    editData(bateria: Bateria) {
        this.bateria = { ...bateria };
        this.dataDialog = true;
    }

    deleteData(bateria: Bateria) {
        this.deleteDataDialog = true;
        this.bateria = { ...bateria };
    }

    confirmDeleteSelected() {
        this.deleteRowsDialog = false;
        console.log(this.selectedRows);
        this.bateriaservice.deleteMultiple(this.selectedRows)
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
        this.bateriaservice.delete(this.bateria)
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
        this.bateria = {};
    }

    hideDialog() {
        this.dataDialog = false;
        this.submitted = false;
        this.bateria = {};
        this.loadData();
    }

    saveData() {
        this.submitted = true;
        if (this.bateria.bat_id) {
            this.bateriaservice.update(this.bateria)
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
            this.bateriaservice.store(this.bateria)
            .subscribe((resp: any) => {
              console.log(resp);
              if(!resp.error && resp){
                this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                this.bateria = {};
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