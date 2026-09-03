import { Component, OnInit } from '@angular/core';
import { Bateria } from '../demo/domain/bateria';
import { Marca } from '../demo/domain/marca';
import { BateriaService } from '../demo/service/bateria.service';
import { MarcaService } from '../demo/service/marca.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../breadcrumb.service';
import { Table } from 'primeng/table';

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
    rowsPerPageOptions = [5, 10, 20, 50];
    carga: boolean = true;

    constructor(
        private bateriaservice: BateriaService, 
        private marcaservice: MarcaService,  
        private messageService: MessageService,
        private confirmationService: ConfirmationService, 
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.setItems([
            { label: 'Administracion' },
            { label: 'Baterías', routerLink: ['/pages/baterias'] }
        ]);
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadDataMarcas(): void {
        this.marcaservice.get(null).subscribe({
            next: (resp: any) => {
                if (!resp.error && resp) {
                    this.marcas = resp.marca || [];
                }
            },
            error: (err: any) => {
                console.error('Error al cargar marcas:', err);
            }
        });
    }

    loadData(): void {
        this.carga = true;
        this.loadDataMarcas();
        this.bateriaservice.get(null).subscribe({
            next: (resp: any) => {
                if (!resp.error && resp) {
                    this.baterias = resp.bateria || resp.data || [];
                }
                this.carga = false;
            },
            error: (err: any) => {
                console.error('Error al cargar baterías:', err);
                this.carga = false;
            }
        });
    }

    openNew(): void {
        this.bateria = {};
        this.submitted = false;
        this.dataDialog = true;
    }

    deleteSelectedRows(): void {
        this.deleteRowsDialog = true;
    }

    editData(bateria: Bateria): void {
        this.bateria = { ...bateria };
        this.submitted = false;
        this.dataDialog = true;
    }

    deleteData(bateria: Bateria): void {
        this.deleteDataDialog = true;
        this.bateria = { ...bateria };
    }

    confirmDeleteSelected(): void {
        this.deleteRowsDialog = false;
        this.bateriaservice.deleteMultiple(this.selectedRows).subscribe({
            next: (resp: any) => {
                if (!resp.error && resp) {
                    this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message || 'Baterías eliminadas', life: 3000 });
                    this.loadData();
                    this.selectedRows = [];
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message || 'Error al eliminar', life: 3000 });
                }
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error?.message || 'Error al eliminar', life: 3000 });
            }
        });
    }

    confirmDelete(): void {
        this.deleteDataDialog = false;
        this.bateriaservice.delete(this.bateria).subscribe({
            next: (resp: any) => {
                if (!resp.error && resp) {
                    this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message || 'Batería eliminada', life: 3000 });
                    this.loadData();
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message || 'Error al eliminar', life: 3000 });
                }
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error?.message || 'Error al eliminar', life: 3000 });
            }
        });
        this.bateria = {};
    }

    hideDialog(): void {
        this.dataDialog = false;
        this.submitted = false;
        this.bateria = {};
    }

    saveData(): void {
        this.submitted = true;
        if (!this.bateria.mar_id || !this.bateria.bat_modelo || !this.bateria.bat_voltaje || !this.bateria.bat_capacidad) {
            return;
        }

        if (this.bateria.bat_id) {
            this.bateriaservice.update(this.bateria).subscribe({
                next: (resp: any) => {
                    if (!resp.error && resp) {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message || 'Batería actualizada', life: 3000 });
                        this.dataDialog = false;
                        this.loadData();
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message || 'Error al actualizar', life: 3000 });
                    }
                },
                error: (err: any) => {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error?.message || 'Error al actualizar', life: 3000 });
                }
            });
        } else {
            this.bateriaservice.store(this.bateria).subscribe({
                next: (resp: any) => {
                    if (!resp.error && resp) {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message || 'Batería guardada', life: 3000 });
                        this.dataDialog = false;
                        this.loadData();
                        this.bateria = {};
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message || 'Error al guardar', life: 3000 });
                    }
                },
                error: (err: any) => {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error?.message || 'Error al guardar', life: 3000 });
                }
            });
        }
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}