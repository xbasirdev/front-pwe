import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { BancoService  } from './banco.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FuseAlertType } from '@fuse/components/alert';
import * as moment from 'moment';
import { AppSettings } from '../../../core/settings/constants';

@Component({
    selector     : 'banco',
    templateUrl  : './banco.component.html',
    styleUrls    : ['./banco.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BancoComponent implements OnInit
{
    public bancos;
    public bancosCount;
    public bancosTableColumns: string[] = ['nombre', 'descripcion', 'opciones', 'acciones'];

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
        public bancoService: BancoService,
        private route: Router,
        private router: ActivatedRoute, 
    ){
     
    }

    ngOnInit(): void {
        this.getList();
    }

    deleteBanco(id): void {
      this.bancoService.deleteBanco(id).subscribe((res) => {
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

    getList(): void {
      this.bancoService.getBancos().subscribe((res) => {
        this.bancosCount = res['data'].length;
        this.bancos = new MatTableDataSource<any>(res['data']);
        this.bancos.paginator = this.paginator;
        this.bancos.sort = this.sort;
      })
    }

    editBanco(id): void {
      this.route.navigate(['/banco/edit/' + id])
    }

    detailBanco(id): void {
      this.route.navigate(['/banco/detail/' + id])
    }
}


@Component({
    selector     : 'banco-add',
    templateUrl  : './banco.add.component.html',
    styleUrls    : ['./banco.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BancoAddComponent implements OnInit
{

    public action = ''; 
    public srcResult = ''; 
    formFieldHelpers: string[] = [''];

    constructor(
        public bancoService: BancoService,
        private route: Router,
        private router: ActivatedRoute, 
    ){
     
    }

    ngOnInit(): void {
        console.log("pantalla correcta")
        if(this.router.snapshot.routeConfig.path !== 'banco/create'){

            if(this.router.snapshot.routeConfig.path === 'banco/edit/:id') {
              this.action = 'Edit';
            }
      
            if(this.router.snapshot.routeConfig.path === 'banco/detail/:id') {
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

    listBancoRoute(): void {
        console.log("entra")
        this.route.navigate(['/banco']);
    }  
}
