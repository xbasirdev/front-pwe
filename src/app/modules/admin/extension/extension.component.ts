import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ExtensionService  } from './extension.service';
import { ElementRef, ViewChild } from '@angular/core';
import { CarreraService  } from './../carrera/carrera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FuseAlertType } from '@fuse/components/alert';
import { Extension } from './extension.model';
import * as moment from 'moment';
import { AppSettings } from '../../../core/settings/constants';
import { toInteger } from 'lodash';

@Component({
    selector     : 'extension',
    templateUrl  : './extension.component.html',
    styleUrls    : ['./extension.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExtensionComponent implements OnInit
{

    public extensiones;
    public extensionesCount;
    public extensionesTableColumns: string[] = ['titulo', 'tipo', 'descripcion', 'carrera', 'periodo', 'acciones'];
    public carreras = [];

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

    public roleId = localStorage.getItem('role') ?? '';

    constructor(
        public extensionService: ExtensionService,
        public carreraService: CarreraService,
        private route: Router,
        private router: ActivatedRoute
    ){

    }

    ngOnInit(): void {
        this.getList();
    }

    getList(): void {
        this.carreraService.getCarreras().subscribe((res) => {
            this.carreras = res['data'];
            this.extensionService.getExtensiones().subscribe((res) => {
                Object.keys(res['data']).forEach(key => {
                    Object.keys(this.carreras).forEach(key2 => {
                        console.log(res['data'][key])
                        console.log(this.carreras[key2])
                        if(res['data'][key].carrera == this.carreras[key2].id.toString()){
                            res['data'][key].carrera = this.carreras[key2].nombre;
                        }
                    })
                })
                this.extensionesCount = res['data'].length;
                this.extensiones = new MatTableDataSource<any>(res['data']);
                this.extensiones.paginator = this.paginator;
                this.extensiones.sort = this.sort;
            })
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.extensiones.filter = filterValue.trim().toLowerCase();
      }

      delete(id): void {
        this.extensionService.deleteExtension(id).subscribe((res) => {
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

      edit(id): void {
        this.route.navigate(['/extension/edit/' + id])
      }

      details(id): void {
        this.route.navigate(['/extension/detail/' + id])
      }
}


@Component({
    selector     : 'extension-add',
    templateUrl  : './extension.add.component.html',
    styleUrls    : ['./extension.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExtensionAddComponent implements OnInit
{

  public action: string = '';
  public srcResult = '';
  public selected = '';
  formFieldHelpers: string[] = [''];


  public extension: Extension = {
    id: null,
    user_id: 1,
    descripcion: '',
    tipo: '',
    titulo: '',
    carrera: '',
    periodo: ''
  };

  public carreras: [];

  public imageShow: string = '';

  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
      type   : 'success',
      message: ''
  };

  constructor(
      public extensionService: ExtensionService,
      public carreraService: CarreraService,
      private route: Router,
      private router: ActivatedRoute,
  ){

  }

  ngOnInit(): void {
    if(this.router.snapshot.routeConfig.path !== 'create'){

      if(this.router.snapshot.routeConfig.path === 'edit/:id') {
        this.action = 'Edit';
      }

      if(this.router.snapshot.routeConfig.path === 'detail/:id') {
        this.action = 'Detail';
      }
      this.getExtension(this.router.snapshot.params.id);
    }
    else {
      this.action = 'Add';
    }

    this.carreraService.getCarreras().subscribe((res) => {
        this.carreras = res['data'];
    });
  }

  getExtension(id): void {
    this.extensionService.getExtension(id).subscribe((res) => {
      this.extension = res['data'];
      this.extension.carrera = toInteger(this.extension.carrera);
      console.log(this.extension)
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontro el extension'
      };
      this.showAlert = true;
    };
  }

  listExtensionRoute(): void {
      this.route.navigate(['/extension']);
  }

  generateFinalForm(): any {
    const finalData = new FormData();
    Object.keys(this.extension).forEach(key => {
      finalData.append(key, this.extension[key]);
    })
    return finalData;
  }

  saveExtension(): void {
    const finalForm = this.generateFinalForm();
    this.extensionService.saveExtension(finalForm).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/extension']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo guardar el registro'
      };
      this.showAlert = true;
    });
  }

  updateExtension(): void {
    const finalForm2 = this.generateFinalForm();
    this.extensionService.updateExtension(this.extension.id, this.extension).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/extension']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo guardar el registro'
      };
      this.showAlert = true;
    });
  }

  seleccionarCarreras(): void {
    this.extension.carrera = '';
    Object.keys(this.carreras).forEach(key => {
      let carrareId = this.carreras[key].id;
      this.extension.carrera = carrareId
    })
  }

  /*
  updateExtension(): void {
    const finalUpdateForm = this.generateFinalForm();
    console.log(finalUpdateForm);
    console.log(this.extension);
    this.extensionService.updateExtension(this.extension.id, this.extension).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se edito correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/extension']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo editar el registro'
      };
      this.showAlert = true;
    });
  }*/
}
