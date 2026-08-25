import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipo } from '../demo/domain/equipo';
import { EquipoService } from '../demo/service/equipo.service';
import { BreadcrumbService } from '../breadcrumb.service';
import { Table } from 'primeng/table';

@Component({
    templateUrl: './app.sede.equipos.component.html',
    styleUrls: ['../../assets/demo/badges.scss']
})
export class AppSedeEquiposComponent implements OnInit {

    equipos: Equipo[] = [];
    carga: boolean = true;
    cliId: any;
    sedeId: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private equiposervice: EquipoService,
        private breadcrumbService: BreadcrumbService
    ) {}

    ngOnInit() {
        this.cliId = this.route.snapshot.params['cliId'];
        this.sedeId = this.route.snapshot.params['sedeId'];

        this.breadcrumbService.setItems([
            { label: 'Administracion' },
            { label: 'Clientes', routerLink: ['/pages/clientes'] },
            { label: 'Sedes', routerLink: ['/pages/clientes/' + this.cliId + '/sedes'] },
            { label: 'Equipos' }
        ]);

        this.loadData();
    }

    loadData() {
        this.carga = true;
        this.equiposervice.getBySede(this.sedeId).subscribe({
            next: (resp: any) => {
                console.log(resp);
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
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    regresar() {
        this.router.navigate(['/pages/clientes/' + this.cliId + '/sedes']);
    }
}
