import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { PresentacionService  } from './presentacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Presentacion } from './presentacion.model';
import { FuseAlertType } from '@fuse/components/alert';
import * as moment from 'moment';
import { AppSettings } from '../../../core/settings/constants';

@Component({
    selector     : 'presentacion',
    templateUrl  : './presentacion.component.html',
    styleUrls    : ['./presentacion.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PresentacionComponent implements OnInit
{
    public presentaciones;
    public presentacionesCount;
    public presentacionesTableColumns: string[] = ['titulo', 'descripcion', 'deporte', 'lugar', 'fecha', 'acciones'];
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
        public presentacionService: PresentacionService,
        private route: Router,
        private router: ActivatedRoute, 
    ){
     
    }

    ngOnInit(): void {
       this.getList();
    }

    getList(): void {
      this.presentacionService.getPresentaciones().subscribe((res) => {
        this.presentacionesCount = res['data'].length;
        this.presentaciones = new MatTableDataSource<any>(res['data']);
        this.presentaciones.paginator = this.paginator;
        this.presentaciones.sort = this.sort;
      })
    }

    applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value;
      this.presentaciones.filter = filterValue.trim().toLowerCase();
    }

    delete(id): void {
      this.presentacionService.deletePresentacion(id).subscribe((res) => {
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
      this.route.navigate(['/presentacion/edit/' + id])
    }

    details(id): void {
      this.route.navigate(['/presentacion/detail/' + id])
    }
}


@Component({
    selector     : 'presentacion-add',
    templateUrl  : './presentacion.add.component.html',
    styleUrls    : ['./presentacion.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PresentacionAddComponent implements OnInit
{

  public action: string = ''; 
  public srcResult = ''; 
  formFieldHelpers: string[] = [''];

  
  public presentacion: Presentacion = {    
    id: null,
    titulo: '',
    user_id: 1,
    descripcion: '',
    deporte: '',
    lugar: '',
  };

  public imageShow: string = '';

  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
      type   : 'success',
      message: ''
  };

  constructor(
      public presentacionService: PresentacionService,
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
      this.getPresentacion(this.router.snapshot.params.id);
    }
    else {
      this.action = 'Add';
    }
  }

  onFileChanged(event) {
    this.removerImagen();
    this.presentacion.img = event.target.files[0];
  }

  getPresentacion(id): void {
    this.presentacionService.getPresentacion(id).subscribe((res) => {
      this.presentacion = res['data'];
      this.presentacion.fecha = moment(this.presentacion.fecha).format("YYYY-MM-DDTHH:mm");
      this.imageShow = AppSettings.URI_GENERAL + this.presentacion.imagen
      console.log(this.imageShow)
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontro la presentacion Deportiva'
      };
      this.showAlert = true;
    };
  }

  listPresentacionesRoute(): void {
      this.route.navigate(['/presentacion']);
  } 
  
  generateFinalForm(): any {
    const finalData = new FormData();
    if(this.presentacion.img){
      finalData.append('img', this.presentacion.img);
    }
    Object.keys(this.presentacion).forEach(key => {
      finalData.append(key, this.presentacion[key]);
    })
    return finalData;
  }
  
  removerImagen(): void {
    this.presentacion.img = null;
    this.presentacion.imagen = '';
  }

  savePresentacion(): void {
    const finalForm = this.generateFinalForm();
    this.presentacionService.savePresentacion(finalForm).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/presentacion']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo guardar el registro'
      };
      this.showAlert = true;
    });
  }

  updatePresentacion(): void {
    const finalUpdateForm = this.generateFinalForm();
    console.log(finalUpdateForm);
    console.log(this.presentacion);
    this.presentacionService.updatePresentacion(this.presentacion.id, this.presentacion).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se edito correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/presentacion']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo editar el registro'
      };
      this.showAlert = true;
    });
  }
}
