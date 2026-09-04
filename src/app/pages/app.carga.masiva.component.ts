import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BreadcrumbService } from '../breadcrumb.service';
import { URL_SERVICIOS } from '../config/config';

@Component({
    templateUrl: './app.carga.masiva.component.html',
    providers: [MessageService],
    styleUrls: ['../../assets/demo/badges.scss']
})
export class AppCargaMasivaComponent implements OnInit {

    tiposCarga: any[] = [];
    tipoSeleccionado: any = null;
    urlSubirArchivo: string = '';

    batchId: any = null;
    migrando: boolean = false;
    migradoExito: boolean = false;
    migradoResumen: any = null;
    migradoResults: any[] = [];
    filtroEstado: string = 'todos'; // 'todos' | 'error' | 'duplicate' | 'success'
    descargandoCsv: boolean = false;

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.setItems([
            { label: 'Administracion' },
            { label: 'Carga Masiva', routerLink: ['/pages/carga-masiva'] }
        ]);
    }

    ngOnInit(): void {
        this.tiposCarga = [
            {
                label: 'Clientes (Listado Simple)',
                value: 'clientes',
                url: '/upload-excel',
                helpColumns: ['cli_nombre', 'cli_identificacion', 'cli_tipo_identificacion'],
                description: 'Carga un listado simple de clientes directamente en la base de datos.'
            },
            {
                label: 'Equipos (Relacionados a Clientes)',
                value: 'equipos',
                url: '/upload-clienteequipo',
                helpColumns: [
                    'equ_modelo', 'equ_serial', 'mar_descripcion',
                    'teq_descripcion', 'equ_cant_baterias', 'cli_identificacion',
                    'equ_ubicacion'
                ],
                description: 'Registra nuevos equipos asociándolos a marcas, tipos de equipos y clientes ya existentes.'
            },
            {
                label: 'Carga Completa (Clientes, Sedes y Equipos)',
                value: 'completa',
                url: '/upload-cliente-full',
                helpColumns: [
                    'id', 'sector_empresa', 'tipo_cliente', 'sigla', 'nombre_empresa',
                    'tipo_identificacion', 'identificacion', 'dv', 'departamento', 'ciudad',
                    'direccion', 'sede', 'ubicacion_equipo', 'contacto1', 'correo_electronico_1',
                    'movil_1', 'contacto_2', 'correo_electronico_2', 'movil_2', 'estado_cliente',
                    'relacion_comercial', 'marca', 'modelo', 'potencia', 'serial',
                    'tipo_equipo', 'cantidad_baterias', 'cantidad_baterias_ext', 'marca_bateria',
                    'referencia', 'voltaje', 'amperaje', 'snmp'
                ],
                description: 'Proceso de dos pasos: primero carga a una zona intermedia (preparación) y luego permite auditar y procesar la migración definitiva de marcas, clientes, sedes, equipos y baterías.'
            }
        ];

        // Seleccionar la carga completa por defecto
        this.tipoSeleccionado = this.tiposCarga[2];
        this.onTipoChange();
    }

    onTipoChange(): void {
        if (this.tipoSeleccionado) {
            this.urlSubirArchivo = URL_SERVICIOS + this.tipoSeleccionado.url;
        } else {
            this.urlSubirArchivo = '';
        }
        this.resetState();
    }

    resetState(): void {
        this.batchId = null;
        this.migrando = false;
        this.migradoExito = false;
        this.migradoResumen = null;
        this.migradoResults = [];
        this.filtroEstado = 'todos';
        this.descargandoCsv = false;
    }

    onUpload(event: any): void {
        const body = event.originalEvent?.body;
        const msg = body?.message || 'Archivo subido y cargado con éxito.';
        const hasErrors = (body?.errorCount && body.errorCount > 0) || !!body?.error_file;

        this.messageService.add({
            severity: hasErrors ? 'warn' : 'success',
            summary: hasErrors ? 'Subida con Observaciones' : 'Subida Exitosa',
            detail: msg + (body?.errorCount ? ` (${body.errorCount} registros con error)` : ''),
            life: 5000
        });

        if (body && body.batch_id) {
            this.batchId = body.batch_id;
            this.migradoExito = false;
            this.migradoResumen = null;
            this.migradoResults = [];
        }
    }

    onError(event: any): void {
        const errMessage = event.error?.message || 'Ocurrió un error inesperado al subir el archivo.';
        this.messageService.add({
            severity: 'error',
            summary: 'Error en Servidor',
            detail: errMessage,
            life: 5000
        });
    }

    procesarMigracion(): void {
        if (!this.batchId) return;

        this.migrando = true;
        this.migradoExito = false;
        this.migradoResumen = null;
        this.migradoResults = [];

        const url = URL_SERVICIOS + '/import-migrate-clients';
        this.http.post(url, { batch_id: this.batchId, format: 'json' }).subscribe({
            next: (resp: any) => {
                this.migrando = false;
                this.migradoExito = true;
                this.migradoResumen = {
                    ...resp.summary,
                    duplicados: resp.summary?.duplicados || 0,
                    errores: resp.summary?.errores || 0
                };

                const rawResults = resp.results || [];
                this.migradoResults = rawResults.map((item: any) => ({
                    ...item,
                    identificacion: item.data?.eis_identificacion || '',
                    nombre: item.data?.eis_nombre_empresa_persona || '',
                    sede: item.data?.eis_sede || '',
                    marca: item.data?.eis_marca_equipo || '',
                    modelo: item.data?.eis_modelo_equipo || '',
                    serial: item.data?.eis_serial_equipo || '',
                    tipo_equipo: item.data?.eis_tipo_equipo || '',
                    descripcion_error: item.error || ''
                }));

                const tieneObs = this.tieneObservaciones;
                this.messageService.add({
                    severity: tieneObs ? 'warn' : 'success',
                    summary: tieneObs ? 'Migración con Observaciones' : 'Migración Completada',
                    detail: resp.message || 'Los datos fueron procesados de manera exitosa.',
                    life: 5000
                });
            },
            error: (err: any) => {
                this.migrando = false;
                const errMessage = err.error?.message || err.error?.error || 'Ocurrió un error al intentar migrar el lote.';
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de Migración',
                    detail: errMessage,
                    life: 5000
                });
            }
        });
    }

    get tieneObservaciones(): boolean {
        return ((this.migradoResumen?.errores || 0) > 0) || ((this.migradoResumen?.duplicados || 0) > 0);
    }

    get resultadosFiltrados(): any[] {
        if (this.filtroEstado === 'todos') {
            return this.migradoResults;
        }
        return this.migradoResults.filter(r => r.status === this.filtroEstado);
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    descargarReporteCsv(): void {
        if (!this.batchId) return;

        this.descargandoCsv = true;
        const url = URL_SERVICIOS + '/import-migrate-clients';
        this.http.post(url, { batch_id: this.batchId, format: 'csv' }, { responseType: 'blob' }).subscribe({
            next: (blob: Blob) => {
                this.descargandoCsv = false;
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = `reporte_migracion_lote_${this.batchId}.csv`;
                a.click();
                URL.revokeObjectURL(objectUrl);

                this.messageService.add({
                    severity: 'info',
                    summary: 'Descarga Lista',
                    detail: 'El reporte CSV se ha descargado correctamente.',
                    life: 3000
                });
            },
            error: () => {
                this.descargandoCsv = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error en Descarga',
                    detail: 'No fue posible descargar el archivo CSV del reporte.',
                    life: 4000
                });
            }
        });
    }
}
