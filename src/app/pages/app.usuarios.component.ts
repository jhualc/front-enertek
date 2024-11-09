import {Component, OnInit} from '@angular/core';
import {User} from '../demo/domain/user';
//import {Marca} from '../demo/domain/marca';
//import {TipoEquipo} from '../demo/domain/tipo.equipo';
import { UserService } from '../demo/service/user.service';
import { AuthService } from '../modules/auth/_services/auth.service';
//import {MarcaService } from '../demo/service/marca.service';
//import {TipoEquipoService } from '../demo/service/tipo.equipo.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BreadcrumbService} from '../breadcrumb.service';
import {Table} from 'primeng/table';

@Component({
    templateUrl: './app.usuarios.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../assets/demo/badges.scss']
})
export class AppUsuariosComponent implements OnInit {

    dataDialog: boolean = false;

    deleteDataDialog: boolean = false;

    deleteRowsDialog: boolean = false;

    //marcas: Marca[] = [];

    //tiposequipo: TipoEquipo[] = [];

    perfiles: any[] = [];

    users: User[] = [];

    user: User = {};

    selectedRows: User[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    
    carga: boolean = true;

    constructor(private userService: UserService, private authService: AuthService, private messageService: MessageService,
                private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Administracion' },
            { label: 'Usuarios', routerLink: ['/pages/usuarios'] }
        ]);

        this.perfiles = [
          { label: 'Administrador', value: 'Administrador' },
          { label: 'Técnico', value: 'Técnico' },
          { label: 'Empresarial', value: 'Empresarial' },
        ];

    }
 
    ngOnInit() {
        //this.productService.getProducts().then(data => this.products = data);
        this.loadData();
    }

/*    loadDataMarcas(){
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
*/
    loadData(){
        this.carga = true;
        //this.loadDataMarcas();
        //this.loadDataTiposEquipo();
        this.userService.get(null).subscribe((resp: any) => {
          console.log(resp);
          if(!resp.error && resp){
                  this.users=resp.user;
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
        this.user = {};
        this.submitted = false;
        this.dataDialog = true;
    }

    deleteSelectedRows() {
        this.deleteRowsDialog = true;
    }

    editData(user: User) {
        this.user = { ...user };
        this.dataDialog = true;
    }

    deleteData(user: User) {
        this.deleteDataDialog = true;
        this.user = { ...user };
    }

    confirmDeleteSelected() {
        this.deleteRowsDialog = false;
        console.log(this.selectedRows);
        this.userService.deleteMultiple(this.selectedRows)
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
        this.userService.delete(this.user)
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
        this.user = {};
    }

    hideDialog() {
        this.dataDialog = false;
        this.submitted = false;
        this.user = {};
        this.loadData();
    }

    saveData() {
        this.submitted = true;
        if (this.user.id) {
            this.userService.update(this.user)
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
          this.user.password = 'rHJ7$p583YL@';
          this.authService.register(this.user)
          .subscribe((resp: any) => {
            console.log(resp);
            if(!resp.error && resp){
              this.messageService.add({ severity: 'success', summary: 'Exitoso!', detail: resp.message, life: 3000 });
              this.user = {};
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