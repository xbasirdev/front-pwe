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
import { UsuarioService } from '../usuario/usuario.service';

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
    public roleId = localStorage.getItem('role') ?? '';

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
                        if(res['data'][key].carrera_id == this.carreras[key2].id){
                            res['data'][key].carrera_id = this.carreras[key2].nombre;
                        }
                    })
                });
                const userId = localStorage.getItem('userID') ?? '';

                if(this.roleId == "2"){
                    this.trabajoService.getTrabajoEgresadoAll().subscribe((res2) => {
                        Object.keys(res2['data']).forEach(key => {
                            Object.keys(res['data']).forEach(key2 => {
                                if(userId == res2['data'][key]['egresado_id'] && res2['data'][key]['bolsa_trabajo_id'] == res['data'][key2]['id']){
                                    res['data'][key2]['aplicacion'] = true;
                                }
                            })
                        });
                    })
                    console.log("final")

                    this.trabajosCount = res['data'].length;
                    this.trabajos = new MatTableDataSource<any>(res['data']);
                    this.trabajos.paginator = this.paginator;
                    this.trabajos.sort = this.sort;
                    console.log(this.trabajos)
                }else{
                    this.trabajosCount = res['data'].length;
                    this.trabajos = new MatTableDataSource<any>(res['data']);
                    this.trabajos.paginator = this.paginator;
                    this.trabajos.sort = this.sort;
                }
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

      postulate(id): void {
        const finalForm = {
            "egresado_id": localStorage.getItem('userID'),
            "bolsa_trabajo_id": id,
            "fecha": new Date().toLocaleDateString('fr-CA'),
            "estado": "aplicacion"
        }

        this.trabajoService.saveAplicacion(finalForm).subscribe((res) => {
            alert("Aplico correctamente a la vacante")
            location.reload();
        }, (error) => {
            console.log(error);
            this.alert = {
            type   : 'error',
            message: 'No se pudo guardar el registro'
            };
            this.showAlert = true;
        });
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


@Component({
    selector     : 'trabajo-aplicacion',
    templateUrl  : './trabajo.aplicacion.component.html',
    styleUrls    : ['./trabajo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrabajoAplicacionComponent implements OnInit
{
    public trabajos;
    public trabajosCount;
    public trabajosTableColumns: string[] = ['trabajo', 'egresado', 'estado', 'fecha', 'opciones'];
    public carreras = [];
    public roleId = localStorage.getItem('role') ?? '';

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
        public userService: UsuarioService,
        private route: Router,
        private router: ActivatedRoute
    ){

    }

    ngOnInit(): void {
        this.trabajoService.getTrabajoEgresadoAll().subscribe((res) => {
            this.trabajoService.getTrabajos().subscribe((res2) => {
                Object.keys(res['data']).forEach(key => {
                    Object.keys(res2['data']).forEach(key2 => {
                        if(res['data'][key]['bolsa_trabajo_id'] == res2['data'][key2]['id']){
                            res['data'][key]['trabajo'] = res2['data'][key2]['nombre'];
                        }
                    })
                });
                this.trabajosCount = res['data'].length;
                this.trabajos = new MatTableDataSource<any>(res['data']);
                this.trabajos.paginator = this.paginator;
                this.trabajos.sort = this.sort;
            })
        })
    }



    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.trabajos.filter = filterValue.trim().toLowerCase();
    }

    redirectTrabajo(id): void {
        this.route.navigate(['/trabajo/detail/' + id])
    }


}
