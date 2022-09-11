import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { EgresadoService  } from './egresado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {formatDate} from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';


@Component({
    selector     : 'egresado',
    templateUrl  : './egresado.component.html',
    styleUrls    : ['./egresado.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EgresadoComponent implements OnInit
{
    public egresados;
    public egresadosCount;
    public egresadosTableColumns: string[] = ['titulo', 'descripcion', 'deporte', 'lugar', 'fecha', 'acciones'];

    constructor(
        public egresadoService: EgresadoService,public dialog: MatDialog
    ){
     
    }

    ngOnInit(): void {
        this.egresadoService.getEgresados().subscribe((res) => {
            console.log(res)
            this.egresados = res['data'];
            this.egresadosCount = this.egresados.length
            console.log(this.egresados)
        })
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
}


@Component({
    selector     : 'egresado-add',
    templateUrl  : './egresado.add.component.html',
    styleUrls    : ['./egresado.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EgresadoAddComponent implements OnInit
{

    public action = ''; 
    public srcResult = ''; 
    public formFieldHelpers = "";

    constructor(
        public egresadoService: EgresadoService,
        private route: Router,
        private router: ActivatedRoute, 
    ){
     
    }

    ngOnInit(): void {
        console.log("pantalla correcta")
        if(this.router.snapshot.routeConfig.path !== 'egresado/create'){

            if(this.router.snapshot.routeConfig.path === 'egresado/edit/:id') {
              this.action = 'Edit';
            }
      
            if(this.router.snapshot.routeConfig.path === 'egresado/detail/:id') {
              this.action = 'Detail';
            }
          }
          else {
            this.action = 'Add';
          }
    }

    onFileSelected(): void {
        const inputNode: any = document.querySelector('#file');      
        if (typeof (FileReader) !== 'undefined') {
          const reader = new FileReader();      
          reader.onload = (e: any) => {
            this.srcResult = e.target.result;
          };      
          reader.readAsArrayBuffer(inputNode.files[0]);
        }
    }

    listEgresadosRoute(): void {
        console.log("entra")
        this.route.navigate(['/egresado']);
    }
}


/**
 * @title Dialog with header, scrollable content and actions
 */
 @Component({
  selector: 'importar-egresado',
  templateUrl: 'egresado.import.component.html',
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