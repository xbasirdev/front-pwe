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
import { User } from '../user/user.model';
import { UsuarioService } from '../usuario/usuario.service';

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

    listEgresadosRoute(): void {
      this.route.navigate(['/egresado']);
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