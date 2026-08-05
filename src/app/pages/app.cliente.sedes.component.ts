import { Component, OnInit } from '@angular/core';
import { Sede } from '../demo/domain/sede';
import { SedeService } from '../demo/service/sede.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../breadcrumb.service';
import { Table } from 'primeng/table';
import { TipoIdentificacion } from '../demo/domain/tipo.identificacion';
import { URL_SERVICIOS } from '../config/config';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './app.cliente.sedes.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['../../assets/demo/badges.scss']
})
export class AppClientesSedesComponent implements OnInit {

  dataDialog: boolean = false;

  dataCargar: boolean = false;

  deleteDataDialog: boolean = false;

  deleteRowsDialog: boolean = false;

  sedes: Sede[] = [];

  sede: Sede = {};

  selectedRows: Sede[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  carga: boolean = true;

  urlsubirarchivo: string = '';

  cli_id: any;

  tiposId: TipoIdentificacion[] = [
    { tipid_id: 'CC', tipid_descripcion: 'CC' },
    { tipid_id: 'CE', tipid_descripcion: 'CE' },
    { tipid_id: 'NIT', tipid_descripcion: 'NIT' },
    // más elementos aquí
  ];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private sedeservice: SedeService) {
    this.breadcrumbService.setItems([
      { label: 'Administracion' },
      { label: 'Clientes', routerLink: ['/pages/clientes'] }
    ]);
  }

  ngOnInit() {
    //this.productService.getProducts().then(data => this.products = data);
    this.urlsubirarchivo = URL_SERVICIOS + '/upload-excel';
    this.cli_id = this.route.snapshot.params['id'];
    this.loadData();
  }

  loadData() {
    this.carga = true;
    this.sedeservice.get(this.cli_id).subscribe((resp: any) => {
      console.log(resp);
      if (!resp.error && resp) {
        this.sedes = resp.data;
        this.carga = false;
      } else {
        if (resp.error == 'Unauthorized') {
          console.log("Usuario no Autorizado");
        }
      }
    })

  }

  openNew() {
    this.sede = {};
    this.submitted = false;
    this.dataDialog = true;
  }

  openCargar() {
    this.sede = {};
    this.submitted = false;
    this.dataCargar = true;
  }

  deleteSelectedRows() {
    this.deleteRowsDialog = true;
  }

  editData(sede: Sede) {
    this.sede = { ...sede };
    this.dataDialog = true;
  }

  deleteData(sede: Sede) {
    this.deleteDataDialog = true;
    this.sede = { ...sede };
  }

  confirmDeleteSelected() {
    this.deleteRowsDialog = false;
    console.log(this.selectedRows);
    this.sedeservice.deleteMultiple(this.selectedRows)
      .subscribe((resp: any) => {
        console.log(resp);
        this.deleteRowsDialog = false;
        if (!resp.error && resp) {
          this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
          this.loadData();
          this.selectedRows = [];
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
        }
      })
  }

  confirmDelete() {
    this.deleteDataDialog = false;
    this.sedeservice.delete(this.sede)
      .subscribe((resp: any) => {
        console.log(resp);
        this.deleteDataDialog = false;
        if (!resp.error && resp) {
          this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
          this.loadData();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
        }
      })
    this.sede = {};
  }

  hideDialog() {
    this.dataDialog = false;
    this.dataCargar = false;
    this.submitted = false;
    this.sede = {};
    this.loadData();
  }

  saveData() {
    this.submitted = true;
    if (this.sede.cls_id) {
      this.sedeservice.update(this.sede)
        .subscribe((resp: any) => {
          console.log(resp);
          if (!resp.error && resp) {
            this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
            this.dataDialog = false;
            this.loadData();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
          }
        })
    }
    else {
      this.sedeservice.store(this.sede)
        .subscribe((resp: any) => {
          console.log(resp);
          if (!resp.error && resp) {
            this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
            this.sede = {};
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
          }
        })
    }
  }

  onUpload(event: any) {
    this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: event.originalEvent.body.message, life: 3000 });
    this.hideDialog();
  }

  onError(event: any) {
    this.messageService.add({ severity: 'error', summary: 'Error!', detail: event.error.message, life: 3000 });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}