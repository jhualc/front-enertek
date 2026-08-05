import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
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
                    'sector empresa', 'tipo cliente', 'sigla', 'nombre empresa persona',
                    'tipo identificacion', 'identificacion', 'dv', 'departamento', 'ciudad',
                    'direccion', 'sede', 'ubicacion equipo', 'nombre contacto 1', 'correo contacto 1',
                    'telefono contacto 1', 'nombre contacto 2', 'correo contacto 2', 'telefono contacto 2',
                    'estado cliente', 'tipo relacion comercial', 'marca equipo', 'tipo equipo',
                    'modelo equipo', 'potencia', 'serial', 'cantidad baterias int', 'cantidad baterias ext',
                    'marca bateria', 'referencia bateria', 'voltaje bateria', 'amperaje bateria', 'snmps'
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
    }

    onUpload(event: any): void {
        const body = event.originalEvent?.body;
        const msg = body?.message || 'Archivo subido y cargado con éxito.';
        
        this.messageService.add({
            severity: 'success',
            summary: 'Subida Exitosa',
            detail: msg,
            life: 4000
        });

        if (body && body.batch_id) {
            this.batchId = body.batch_id;
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

        const url = URL_SERVICIOS + '/import-migrate-clients';
        this.http.post(url, { batch_id: this.batchId }).subscribe({
            next: (resp: any) => {
                this.migrando = false;
                this.migradoExito = true;
                this.migradoResumen = resp.summary;
                
                this.messageService.add({
                    severity: 'success',
                    summary: 'Migración Completada',
                    detail: resp.message || 'Los datos fueron procesados de manera exitosa.',
                    life: 4000
                });
            },
            error: (err: any) => {
                this.migrando = false;
                const errMessage = err.error?.message || 'Ocurrió un error al intentar migrar el lote.';
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de Migración',
                    detail: errMessage,
                    life: 5000
                });
            }
        });
    }
}
