import { Component, OnInit, ViewEncapsulation, Inject, Input,ElementRef, ViewChild  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UsuarioService  } from './usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {formatDate} from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseAnimations } from '@fuse/animations';
import * as moment from 'moment';
import { Usuario } from './usuario.model';
import { AuthResetPasswordComponent } from 'app/modules/auth/reset-password/reset-password.component';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseValidators } from '@fuse/validators';
import { ChangePasswordComponent } from 'app/modules/auth/change-password/change-password.component';
import { User } from '../user/user.model';

@Component({
    selector     : 'usuario',
    templateUrl  : './usuario.component.html',
    styleUrls    : ['./usuario.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class UsuarioComponent implements OnInit
{
    public usuarios;
    public usuariosCount;
    public usuariosTableColumns: string[] = ['nombres','cedula', 'correo', 'acciones'];
    showAlert: boolean = false;
    alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };

    
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;



    constructor(
        public usuarioService: UsuarioService,
        public dialog: MatDialog,
        private route: Router,
        private router: ActivatedRoute
    ){
     
    }

    ngOnInit(): void {
      this.getList();
    }

    getList(): void {
      this.usuarioService.getUsuarios().subscribe((res) => {
        this.usuariosCount = res['data'].length;
        this.usuarios = new MatTableDataSource<any>(res['data']);
        this.usuarios.paginator = this.paginator;
        this.usuarios.sort = this.sort;
      })
    }

    openExportDialog() {
      const exportDialog = this.dialog.open(UsuarioExportComponent);  
      exportDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    openImportDialog() {
      const importDialog = this.dialog.open(UsuarioImportComponent);  
      importDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    delete(cedula:string): void {
      this.usuarioService.deleteUsuario(cedula).subscribe((res) => {
        this.getList();
      }, (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se pudo borrar el registro'
        };
        this.showAlert = true;
      });
    }

    edit(cedula:string): void {
      this.route.navigate(['/usuario/edit/' + cedula])
    }

    details(cedula:string): void {
      this.route.navigate(['/usuario/detail/' + cedula])
    }
}


@Component({
    selector     : 'usuario-add',
    templateUrl  : './usuario.add.component.html',
    styleUrls    : ['./usuario.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class UsuarioAddComponent implements OnInit
{

  @ViewChild('registerUserFormNgForm') registerUserNgForm: NgForm;
  public registerUserForm: FormGroup;
  public cedula: string = "";
  public action: string = "";
  public usuario: User;

    constructor(
        private route: Router,
        private router: ActivatedRoute,     
    ){
     
    }

    ngOnInit(): void {
      this.cedula = this.router.snapshot.params.id;
          
      if(this.router.snapshot.routeConfig.path === 'create'){
        this.action = 'Add';
      }else{
        if(this.router.snapshot.routeConfig.path === 'edit/:id') {
          this.action = 'Edit';
        }
        if(this.router.snapshot.routeConfig.path === 'detail/:id') {
          this.action = 'Detail'; 
        }
      }  
    }

    listUsuariosRoute(): void {
      this.route.navigate(['/usuario']);
    }
}


/**
 * @title Dialog with header, scrollable content and actions
 */
 @Component({
  selector: 'importar-usuario',
  templateUrl: 'usuario.import.component.html',
  animations   : FuseAnimations
})

export class UsuarioImportComponent {
  showAlert: boolean = false;
  actionG: string="";
  types = [
    {
      "name":"update_and_create",
      "value":"Actualizar y crear usuarios nuevos",
    },
    {
      "name":"only_update",
      "value": "Solo actualizar usuarios existentes",
    },
    {
      "name":"only_create",
      "value":"Solo crear usuarios nuevos"
    }, 
  ];

  alert: { type: FuseAlertType, message: string } = {
    type   : 'success',
    message: ''
  };

  file: string | ArrayBuffer;
    
  constructor( public usuarioService: UsuarioService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  alertMessage(){
    this.alert = {
      type   : 'error',
      message: "Seleccione una accion"
    };
    this.showAlert = true;
  }

  uploadFile(event: Event) {
    if( this.actionG == undefined){
      this.alert = {
        type   : 'error',
        message: "Seleccione una accion"
      };
      this.showAlert = true;
      return;
    }
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      let formModel = new FormData();
      formModel.append("file",fileList[0]);
      formModel.append("action",this.actionG);
      formModel.append("act_on","administrator");
      this.usuarioService.importUsuarios(formModel).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: res.message
        };
        this.showAlert = true;
      }, (error) => {
            var e = "";
          if( error.error.error.message != undefined){
            e = error.error.error.message + " " + (error.error.error.message[0]??"");
          }
          else{
            if(error.error.error[Object.keys(error.error.error)[0]][0] != undefined){
              e = error.error.error[Object.keys(error.error.error)[0]][0];
            }
            else if( error.error.message != undefined){
              e = error.error.message;
            }else{
              e = error.message;
            }
          }
          this.alert = {
            type   : 'error',
            message: e
          };
          this.showAlert = true;
        
      });
    }
  }

}


/**
 * @title Dialog with header, scrollable content and actions
 */
 @Component({
  selector: 'exportar-usuario',
  templateUrl: 'usuario.export.component.html',
  animations   : FuseAnimations
})

export class UsuarioExportComponent {

  export_type: string;
  types: string[] = ['xlsx', 'xls', 'csv'];
  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
    type   : 'success',
    message: ''
  };
  constructor(  public usuarioService: UsuarioService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  ExportUsuariosOption(): void{
    if( this.export_type == undefined){
      this.alert = {
        type   : 'error',
        message: "Seleccione un formato"
      };
      this.showAlert = true;
      return;
    }
    
    this.usuarioService.exportUsuarios({'base_format':this.export_type, 'act_on':'administrator'}).subscribe((res) => {      
      const blob = new Blob([res.body], { type: res.headers.get('content-type') });
      let date = formatDate(new Date(), 'yyyyMMddhsm', 'en');
      const fileName ="usuarios-"+date+"."+this.export_type;
      const file = new File([blob], fileName, { type: res.headers.get('content-type') });
      saveAs(file);
        this.alert = {
          type   : 'success',
          message: 'archivo exportado correctamente'
        };
        this.showAlert = true;
      }, (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se pudo exportar el registro'
        };
        this.showAlert = true;
      });
  }
}

export interface DialogData {}