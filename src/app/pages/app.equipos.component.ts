import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipo } from '../demo/domain/equipo';
import { Marca } from '../demo/domain/marca';
import { TipoEquipo } from '../demo/domain/tipo.equipo';
import { EquipoService } from '../demo/service/equipo.service';
import { MarcaService } from '../demo/service/marca.service';
import { TipoEquipoService } from '../demo/service/tipo.equipo.service';
import { ClienteService } from '../demo/service/cliente.service';
import { SedeService } from '../demo/service/sede.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../breadcrumb.service';
import { Table } from 'primeng/table';
import { URL_SERVICIOS } from '../config/config';

@Component({
    templateUrl: './app.equipos.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../assets/demo/badges.scss']
})
export class AppEquiposComponent implements OnInit {

    dataDialog: boolean = false;
    deleteDataDialog: boolean = false;
    deleteRowsDialog: boolean = false;

    marcas: Marca[] = [];
    tiposequipo: TipoEquipo[] = [];
    equipos: Equipo[] = [];
    equipo: Equipo = {};
    selectedRows: Equipo[] = [];

    // Contexto de Sede
    isSedeContext: boolean = false;
    cliId: any = null;
    sedeId: any = null;
    sedeActual: any = null;

    // Selector en cascada para modo global
    clientes: any[] = [];
    sedesCliente: any[] = [];
    selectedClienteId: any = null;
    cargandoSedes: boolean = false;

    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20, 50];
    carga: boolean = true;
    dataCargar: boolean = false;
    urlsubirarchivo: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private equiposervice: EquipoService,
        private marcaservice: MarcaService,
        private tiposequiposervice: TipoEquipoService,
        private clienteService: ClienteService,
        private sedeService: SedeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private breadcrumbService: BreadcrumbService
    ) {}

    ngOnInit(): void {
        this.urlsubirarchivo = URL_SERVICIOS + '/upload-cliente-full';
        
        // Detectar si la ruta viene con parámetros de cliente y sede
        this.cliId = this.route.snapshot.params['cliId'];
        this.sedeId = this.route.snapshot.params['sedeId'];
        this.isSedeContext = !!(this.cliId && this.sedeId);

        if (this.isSedeContext) {
            this.breadcrumbService.setItems([
                { label: 'Administracion' },
                { label: 'Clientes', routerLink: ['/pages/clientes'] },
                { label: 'Sedes', routerLink: ['/pages/clientes/' + this.cliId + '/sedes'] },
                { label: 'Equipos' }
            ]);
            this.loadSedeActual();
        } else {
            this.breadcrumbService.setItems([
                { label: 'Administracion' },
                { label: 'Equipos', routerLink: ['/pages/equipos'] }
            ]);
            this.loadClientes();
        }

        this.loadData();
    }

    loadSedeActual(): void {
        if (!this.sedeId) return;
        this.sedeService.getSede(this.sedeId).subscribe({
            next: (resp: any) => {
                this.sedeActual = resp.data || resp;
            },
            error: (err: any) => {
                console.error('Error al cargar la sede actual:', err);
            }
        });
    }

    loadClientes(): void {
        this.clienteService.get(null).subscribe({
            next: (resp: any) => {
                if (!resp.error && resp) {
                    this.clientes = resp.cliente || [];
                }
            },
            error: (err: any) => {
                console.error('Error al cargar clientes:', err);
            }
        });
    }

    onClienteChange(clienteId: any): void {
        this.equipo.cls_id = null;
        this.sedesCliente = [];
        if (clienteId) {
            this.cargandoSedes = true;
            this.sedeService.get(clienteId).subscribe({
                next: (resp: any) => {
                    this.sedesCliente = resp.data || [];
                    this.cargandoSedes = false;
                },
                error: (err: any) => {
                    console.error('Error al cargar sedes del cliente:', err);
                    this.cargandoSedes = false;
                }
            });
        }
    }

    loadDataMarcas(): void {
        this.marcaservice.get(null).subscribe({
            next: (resp: any) => {
                if (!resp.error && resp) {
                    this.marcas = resp.marca;
                }
            },
            error: (err: any) => {
                console.error('Error al cargar marcas:', err);
            }
        });
    }

    loadDataTiposEquipo(): void {
        this.tiposequiposervice.get(null).subscribe({
            next: (resp: any) => {
                if (!resp.error && resp) {
                    this.tiposequipo = resp.tipo_equipo;
                }
            },
            error: (err: any) => {
                console.error('Error al cargar tipos de equipo:', err);
            }
        });
    }

    loadData(): void {
        this.carga = true;
        this.loadDataMarcas();
        this.loadDataTiposEquipo();

        if (this.isSedeContext) {
            this.equiposervice.getBySede(this.sedeId).subscribe({
                next: (resp: any) => {
                    if (!resp.error && resp) {
                        this.equipos = resp.equipo || resp.data || resp.equipos || [];
                    }
                    this.carga = false;
                },
                error: (err: any) => {
                    console.error(err);
                    this.carga = false;
                }
            });
        } else {
            this.equiposervice.get(null).subscribe({
                next: (resp: any) => {
                    if (!resp.error && resp) {
                        this.equipos = resp.equipo || resp.data || [];
                    }
                    this.carga = false;
                },
                error: (err: any) => {
                    console.error(err);
                    this.carga = false;
                }
            });
        }
    }

    openNew(): void {
        this.equipo = {};
        this.submitted = false;

        if (this.isSedeContext) {
            this.equipo.cls_id = parseInt(this.sedeId, 10);
        } else {
            this.selectedClienteId = null;
            this.sedesCliente = [];
        }

        this.dataDialog = true;
    }

    openCargar(): void {
        this.equipo = {};
        this.submitted = false;
        this.dataCargar = true;
    }

    deleteSelectedRows(): void {
        this.deleteRowsDialog = true;
    }

    editData(equipo: Equipo): void {
        this.equipo = { ...equipo };
        this.submitted = false;

        if (this.isSedeContext) {
            this.equipo.cls_id = parseInt(this.sedeId, 10);
        } else {
            // Resolver cliente de la sede para precargar el selector en cascada
            const cliId = equipo.sede?.cli_id;
            if (cliId) {
                this.selectedClienteId = cliId;
                this.cargandoSedes = true;
                this.sedeService.get(cliId).subscribe({
                    next: (resp: any) => {
                        this.sedesCliente = resp.data || [];
                        this.cargandoSedes = false;
                    },
                    error: () => {
                        this.cargandoSedes = false;
                    }
                });
            } else if (equipo.cls_id) {
                this.sedeService.getSede(equipo.cls_id).subscribe({
                    next: (resp: any) => {
                        const sede = resp.data || resp;
                        if (sede && sede.cli_id) {
                            this.selectedClienteId = sede.cli_id;
                            this.sedeService.get(sede.cli_id).subscribe((r: any) => {
                                this.sedesCliente = r.data || [];
                            });
                        }
                    }
                });
            }
        }

        this.dataDialog = true;
    }

    deleteData(equipo: Equipo): void {
        this.deleteDataDialog = true;
        this.equipo = { ...equipo };
    }

    confirmDeleteSelected(): void {
        this.deleteRowsDialog = false;
        this.equiposervice.deleteMultiple(this.selectedRows).subscribe({
            next: (resp: any) => {
                if (!resp.error && resp) {
                    this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                    this.loadData();
                    this.selectedRows = [];
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
                }
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error?.message || 'Error al eliminar', life: 3000 });
            }
        });
    }

    confirmDelete(): void {
        this.deleteDataDialog = false;
        this.equiposervice.delete(this.equipo).subscribe({
            next: (resp: any) => {
                if (!resp.error && resp) {
                    this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                    this.loadData();
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
                }
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error?.message || 'Error al eliminar', life: 3000 });
            }
        });
        this.equipo = {};
    }

    hideDialog(): void {
        this.dataDialog = false;
        this.submitted = false;
        this.dataCargar = false;
        this.equipo = {};
    }

    saveData(): void {
        this.submitted = true;

        // Asegurar cls_id en contexto de sede
        if (this.isSedeContext && !this.equipo.cls_id) {
            this.equipo.cls_id = parseInt(this.sedeId, 10);
        }

        // Validación de campos obligatorios
        if (!this.equipo.mar_id || !this.equipo.teq_id || !this.equipo.equ_modelo || !this.equipo.equ_serial || !this.equipo.cls_id) {
            return;
        }

        if (this.equipo.equ_id) {
            this.equiposervice.update(this.equipo).subscribe({
                next: (resp: any) => {
                    if (!resp.error && resp) {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                        this.dataDialog = false;
                        this.loadData();
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
                    }
                },
                error: (err: any) => {
                    const msg = err.error?.message || 'Error al actualizar el equipo.';
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: msg, life: 4000 });
                }
            });
        } else {
            this.equiposervice.store(this.equipo).subscribe({
                next: (resp: any) => {
                    if (!resp.error && resp) {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
                        this.dataDialog = false;
                        this.loadData();
                        this.equipo = {};
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error!', detail: resp.message, life: 3000 });
                    }
                },
                error: (err: any) => {
                    const msg = err.error?.message || 'Error al registrar el equipo.';
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: msg, life: 4000 });
                }
            });
        }
    }

    regresarASedes(): void {
        this.router.navigate(['/pages/clientes/' + this.cliId + '/sedes']);
    }

    onUpload(event: any): void {
        this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: event.originalEvent?.body?.message || 'Archivo cargado con éxito', life: 3000 });
        this.hideDialog();
        this.loadData();
    }

    onError(event: any): void {
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: event.error?.message || 'Error al subir archivo', life: 3000 });
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}