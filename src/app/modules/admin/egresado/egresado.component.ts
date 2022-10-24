import { Component, OnInit, ViewEncapsulation, Inject, Input,ElementRef, ViewChild  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { EgresadoService  } from './egresado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {formatDate} from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Egresado } from './egresado.model';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthResetPasswordComponent } from 'app/modules/auth/reset-password/reset-password.component';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseValidators } from '@fuse/validators';
import { ChangePasswordComponent } from 'app/modules/auth/change-password/change-password.component';

@Component({
    selector     : 'egresado',
    templateUrl  : './egresado.component.html',
    styleUrls    : ['./egresado.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class EgresadoComponent implements OnInit
{
    public egresados;
    public egresadosCount;
    public egresadosTableColumns: string[] = ['nombres', 'cedula', 'carrera', 'egreso', 'acciones'];
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
        public egresadoService: EgresadoService, 
        public dialog: MatDialog,
        private route: Router,
        private router: ActivatedRoute
    ){
     
    }

    ngOnInit(): void {
      this.getList();
    }

    getList(): void {
      this.egresadoService.getEgresados().subscribe((res) => {
        this.egresadosCount = res['data'].length;
        this.egresados = new MatTableDataSource<any>(res['data']);
        this.egresados.paginator = this.paginator;
        this.egresados.sort = this.sort;
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.egresados.filter = filterValue.trim().toLowerCase();
  }

     
    openExportDialog() {
      const exportDialog = this.dialog.open(EgresadoExportComponent);  
      exportDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    openImportDialog() {
      const importDialog = this.dialog.open(EgresadoImportComponent);  
      importDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    
    delete(cedula:string): void {
      this.egresadoService.deleteEgresado(cedula).subscribe((res) => {
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
      this.route.navigate(['/egresado/edit/' + cedula])
    }

    details(cedula:string): void {
      this.route.navigate(['/egresado/detail/' + cedula])
    }
}


@Component({
    selector     : 'egresado-add',
    templateUrl  : './egresado.add.component.html',
    styleUrls    : ['./egresado.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class EgresadoAddComponent implements OnInit
{
    @ViewChild('registerUserFormNgForm') registerUserNgForm: NgForm;
    public registerUserForm: FormGroup;
    public action = ''; 
    public showNotification = true;
    public srcResult = ''; 
    public formFieldHelpers = "";
    public egresado: Egresado = {
      nombres: '',
      apellidos: "",
      cedula: '',
      correo: '',
      telefono: '',
      egresado:{
        fecha_egreso: '',
        modo_registro: '',
        notificacion: false,
        periodo_egreso: '',
        correo: '',
        carrera : { 
            nombre: '',
            estado: '',
        }
      }
    };
    public formBuilderGroup = {
      nombres:['', Validators.required],
      apellidos:['', Validators.required],
      cedula:['', Validators.required],
      periodo_egreso:['', Validators.required],
      correo:['', [Validators.required,Validators.email]],
      correo_personal:["",[Validators.email]],
      password:['', Validators.required],
      password_confirm:['', Validators.required],
      fecha_egreso:[''],
      telefono:[""]
    };
    
  
    public showAlert: boolean = false;
    public alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };

    constructor(
        public egresadoService: EgresadoService,
        public dialog: MatDialog,
        private route: Router,
        private router: ActivatedRoute, 
        private _authService: AuthService, 
        private _formBuilder: FormBuilder,
    ){
     
    }

    ngOnInit(): void {

        if(this.router.snapshot.routeConfig.path !== 'create'){
          this.getEgresado(this.router.snapshot.params.id); 
          if(this.router.snapshot.routeConfig.path === 'edit/:id') {
            this.action = 'Edit';
          }
    
          if(this.router.snapshot.routeConfig.path === 'detail/:id') {
            this.action = 'Detail';
            this.registerUserForm.disable();
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

   

    changeNotificationStatus( status: boolean): void{
      let id =  this.router.snapshot.paramMap.get('id') ?? this._authService.accessEmail; 
      this.egresadoService.updateNotificationStatus({"status": status, "id":id}).subscribe((res) => {
        status = !status;
        this.showNotification = status;
        
      }), (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se encontro el egresado'
        };
        this.showAlert = true;
      };
    }

    getEgresado(cedula: string): void {
      this.egresadoService.getEgresado(cedula).subscribe((res) => {
        this.egresado = res['data'];
        if(!this.egresado.egresado.notificacion){
          this.showNotification = false;
        }        
        this.egresado.egresado.fecha_egreso = moment(this.egresado.egresado.fecha_egreso).format("YYYY-MM-DDTHH:mm");
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
          message: 'No se encontro el egresado'
        };
        this.showAlert = true;
      };
    }

    listEgresadosRoute(): void {
      this.route.navigate(['/egresado']);
    }

    saveEgresado(): void {
      // Do nothing if the form is invalid
      if ( this.registerUserForm.invalid )
      {
          return;
      }

      // Disable the form
      this.registerUserForm.disable();

      // Hide the alert
      this.showAlert = false;

      this.egresadoService.saveEgresado(this.registerUserForm.value).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: 'Se guardo correctamente el registro'
        };
        this.showAlert = true;
        this.route.navigate(['/egresado']);
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
  
    updateEgresado(): void {
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
      this.egresadoService.updateEgresado(this.egresado.cedula, this.registerUserForm.value).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: 'Se edito correctamente el registro'
        };
        this.showAlert = true;
        this.route.navigate(['/egresado']);
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
}


/**
 * @title Dialog with header, scrollable content and actions
 */
 @Component({
  selector: 'importar-egresado',
  templateUrl: 'egresado.import.component.html',
  styleUrls    : ['./egresado.component.scss'],
  animations   : FuseAnimations
})

export class EgresadoImportComponent {
  showAlert: boolean = false;
  actionG: string="";
  types = [
    {
      "name":"update_and_create",
      "value":"Actualizar y crear egresados nuevos",
    },
    {
      "name":"only_update",
      "value": "Solo actualizar egresados existentes",
    },
    {
      "name":"only_create",
      "value":"Solo crear egresados nuevos"
    }, 
  ];

  alert: { type: FuseAlertType, message: string } = {
    type   : 'success',
    message: ''
  };

  file: string | ArrayBuffer;
    
  constructor(  public egresadoService: EgresadoService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

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
      this.egresadoService.importEgresados(formModel).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: 'egresados importados correctamente.'
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
  selector: 'exportar-egresado',
  templateUrl: 'egresado.export.component.html',
  styleUrls    : ['./egresado.component.scss'],
  animations   : FuseAnimations
})

export class EgresadoExportComponent {

  export_type: string;
  types: string[] = ['xlsx', 'xls', 'csv'];
  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
    type   : 'success',
    message: ''
  };
  constructor(  public egresadoService: EgresadoService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  ExportEgresadosOption(): void{
    if( this.export_type == undefined){
      this.alert = {
        type   : 'error',
        message: "Seleccione un formato"
      };
      this.showAlert = true;
      return;
    }
    
    this.egresadoService.exportEgresados({'base_format':this.export_type, 'act_on':'graduate'}).subscribe((res) => {      
      const blob = new Blob([res.body], { type: res.headers.get('content-type') });
      let date = formatDate(new Date(), 'yyyyMMddhsm', 'en');
      const fileName ="egresados-"+date+"."+this.export_type;
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