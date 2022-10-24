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
        this.alert = {
          type   : 'success',
          message: 'Se borro correctamente el registro'
        };
        this.showAlert = true;
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
  public action = ''; 
  public showNotification = true;
  public srcResult = ''; 
  public formFieldHelpers = "";
  public usuario: Usuario = {
    nombres: '',
    apellidos: "",
    cedula: '',
    correo: '',
    telefono: '',
  };

  public formBuilderGroup = {
    nombres:['', Validators.required],
    apellidos:['', Validators.required],
    cedula:['', Validators.required],
    correo:['', [Validators.required,Validators.email]],
    password:['', Validators.required],
    password_confirm:['', Validators.required],
    telefono:[""]
  };

  

  public showAlert: boolean = false;
  public alert: { type: FuseAlertType, message: string } = {
      type   : 'success',
      message: ''
  };

    constructor(
        public usuarioService: UsuarioService,
        private route: Router,
        private router: ActivatedRoute, 
        public dialog: MatDialog,
        private _authService: AuthService, 
        private _formBuilder: FormBuilder,     
    ){
     
    }

    ngOnInit(): void {
      
          if(this.router.snapshot.routeConfig.path !== 'create'){
            this.getUsuario(this.router.snapshot.params.id);
            if(this.router.snapshot.routeConfig.path === 'edit/:id') {
              this.action = 'Edit';
            }
      
            if(this.router.snapshot.routeConfig.path === 'detail/:id') {
              this.action = 'Detail'; 
            }
          }
          else {
            this.action = 'Add';
            this.registerUserForm = this._formBuilder.group(this.formBuilderGroup, {
                validators: FuseValidators.mustMatch('password', 'password_confirm')
              }
            );
          }
    }

    getUsuario(cedula: string): void {
      this.usuarioService.getUsuario(cedula).subscribe((res) => {
        this.usuario = res['data'];
        this.formBuilderGroup.password = [""];
        this.formBuilderGroup.password_confirm = [""];
        this.registerUserForm = this._formBuilder.group(this.formBuilderGroup);
        if(this.action == 'Detail'){
          this.registerUserForm.disable();
        }
      }), (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se encontro el usuario'
        };
        this.showAlert = true;
      };
    }

    listusuariosRoute(): void {
      this.route.navigate(['/usuario']);
    }

    saveUsuario(): void {
      // Do nothing if the form is invalid
      if ( this.registerUserForm.invalid )
      {
          return;
      }

      // Disable the form
      this.registerUserForm.disable();

      // Hide the alert
      this.showAlert = false;

      this.usuarioService.saveUsuario(this.registerUserForm.value).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: 'Se guardo correctamente el registro'
        };
        this.showAlert = true;
        this.route.navigate(['/usuario']);
      }, (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se pudo guardar el registro'
        };
        this.showAlert = true;
        
        // Re-enable the form
        this.registerUserForm.enable();

        // Reset the form
        this.registerUserNgForm.resetForm();
      });
    }
  
    updateUsuario(): void {
      // Do nothing if the form is invalid
      console.log(this.registerUserForm.invalid);
      if ( this.registerUserForm.invalid )
      {
          return;
      }

      // Disable the form
      this.registerUserForm.disable();

      // Hide the alert
      this.showAlert = false;
      this.usuarioService.updateUsuario(this.usuario.cedula, this.registerUserForm.value).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: 'Se edito correctamente el registro'
        };
        this.showAlert = true;
        this.route.navigate(['/usuario']);
      }, (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se pudo editar el registro'
        };
        this.showAlert = true;
         
        // Re-enable the form
        this.registerUserForm.enable();

        // Reset the form
        this.registerUserNgForm.resetForm();
      });
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
    
  constructor(  public usuarioService: UsuarioService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

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
      formModel.append("act_on","graduate");
      this.usuarioService.importUsuarios(formModel).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: 'usuarios importados correctamente.'
        };
        this.showAlert = true;
      }, (error) => {
        
        var e = "";
        if( error.error.error.message != undefined){
          e = error.error.error.message + " " + (error.error.error.messages[0]??"");
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
    
    this.usuarioService.exportUsuarios({'base_format':this.export_type, 'act_on':'graduate'}).subscribe((res) => {      
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