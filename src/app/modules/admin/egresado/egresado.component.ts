import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EgresadoService  } from './egresado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {formatDate} from '@angular/common';


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
        public egresadoService: EgresadoService,
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
    ExportEgresadosOption(type): void{
      this.egresadoService.exportEgresados({'base_format':type, 'act_on':'graduate'}).subscribe((res) => {      
        const blob = new Blob([res.body], { type: res.headers.get('content-type') });
        let date = formatDate(new Date(), 'yyyyMMddhsm', 'en');
        const fileName ="egresados-"+date+".xlsx";
        const file = new File([blob], fileName, { type: res.headers.get('content-type') });
        saveAs(file);
      })
    }

    ImportEgresadosOption(): void{
      this.egresadoService.importEgresados({'base_format':'xlsx', 'act_on':'graduate'}).subscribe((res) => {
        console.log(res)
        this.egresados = res['data'];
        this.egresadosCount = this.egresados.length
        console.log(this.egresados)
      })
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
    formFieldHelpers: string[] = [''];

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
