import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TrabajoService  } from './trabajo.service';
import { ElementRef, ViewChild } from '@angular/core';
import { CarreraService  } from './../carrera/carrera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FuseAlertType } from '@fuse/components/alert';
import { Trabajo } from './trabajo.model';
import * as moment from 'moment';
import { AppSettings } from '../../../core/settings/constants';
import { toInteger } from 'lodash';


@Component({
    selector     : 'trabajo',
    templateUrl  : './trabajo.component.html',
    styleUrls    : ['./trabajo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrabajoComponent implements OnInit
{
    public trabajos;
    public trabajosCount;
    public trabajosTableColumns: string[] = ['nombre', 'empresa', 'requisitos', 'carrera', 'fecha publicacion', 'contacto', 'opciones', 'acciones'];
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

    constructor(
        public trabajoService: TrabajoService,
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
            this.trabajoService.getTrabajos().subscribe((res) => {
                Object.keys(res['data']).forEach(key => {
                    Object.keys(this.carreras).forEach(key2 => {
                        console.log(res['data'][key])
                        console.log(this.carreras[key2])
                        if(res['data'][key].carrera_id == this.carreras[key2].id){
                            res['data'][key].carrera_id = this.carreras[key2].nombre;
                        }
                    })
                })
                this.trabajosCount = res['data'].length;
                this.trabajos = new MatTableDataSource<any>(res['data']);
                this.trabajos.paginator = this.paginator;
                this.trabajos.sort = this.sort;
            })
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.trabajos.filter = filterValue.trim().toLowerCase();
      }

      delete(id): void {
        this.trabajoService.deleteTrabajo(id).subscribe((res) => {
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
        this.route.navigate(['/trabajo/edit/' + id])
      }

      details(id): void {
        this.route.navigate(['/trabajo/detail/' + id])
      }
}

@Component({
    selector     : 'trabajo-add',
    templateUrl  : './trabajo.add.component.html',
    styleUrls    : ['./trabajo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrabajoAddComponent implements OnInit
{

  public action: string = '';
  public srcResult = '';
  public selected = '';
  formFieldHelpers: string[] = [''];


  public trabajo: Trabajo = {
    id: null,
    user_id: 1,
    nombre: '',
    empresa: '',
    requisitos: '',
    carrera_id: '',
    estatus: 'activo',
    vacantes: 1,
    fecha_publicacion: new Date().toLocaleDateString('fr-CA')

  };

  public carreras: [];

  public imageShow: string = '';

  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
      type   : 'success',
      message: ''
  };

  constructor(
      public trabajoService: TrabajoService,
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
      this.getTrabajo(this.router.snapshot.params.id);
    }
    else {
      this.action = 'Add';
    }

    this.carreraService.getCarreras().subscribe((res) => {
        this.carreras = res['data'];
    });
  }

  getTrabajo(id): void {
    this.trabajoService.getTrabajo(id).subscribe((res) => {
      this.trabajo = res['data'];
      this.trabajo.carrera_id = toInteger(this.trabajo.carrera_id);
      console.log(this.trabajo)
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontro el trabajo'
      };
      this.showAlert = true;
    };
  }

  listTrabajoRoute(): void {
      this.route.navigate(['/trabajo']);
  }

  generateFinalForm(): any {
    const finalData = new FormData();
    Object.keys(this.trabajo).forEach(key => {
      finalData.append(key, this.trabajo[key]);
    })
    return finalData;
  }

  saveTrabajo(): void {
    const finalForm = this.generateFinalForm();
    this.trabajoService.saveTrabajo(finalForm).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/trabajo']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo guardar el registro'
      };
      this.showAlert = true;
    });
  }

  updateTrabajo(): void {
    const finalForm2 = this.generateFinalForm();
    this.trabajoService.updateTrabajo(this.trabajo.id, this.trabajo).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/trabajo']);
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
    this.trabajo.carrera_id = '';
    Object.keys(this.carreras).forEach(key => {
      let carrareId = this.carreras[key].id;
      this.trabajo.carrera_id = carrareId
    })
  }
}
