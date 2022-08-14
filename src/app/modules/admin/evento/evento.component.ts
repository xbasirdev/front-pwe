import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { EventoService  } from './evento.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FuseAlertType } from '@fuse/components/alert';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Evento } from './evento.model';
import { AppSettings } from '../../../core/settings/constants';

@Component({
    selector     : 'evento',
    templateUrl  : './evento.component.html',
    styleUrls    : ['./evento.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EventoComponent implements OnInit
{
    public eventos;
    public eventosCount;
    public eventosTableColumns: string[] = ['titulo', 'descripcion', 'carreras', 'lugar', 'acciones'];
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
        public eventoService: EventoService,
        private route: Router,
        private router: ActivatedRoute
    ){

    }

    ngOnInit(): void {
        this.getList();
    }

    getList(): void {
        this.eventoService.getEventos().subscribe((res) => {
          this.eventosCount = res['data'].length;
          this.eventos = new MatTableDataSource<any>(res['data']);
          this.eventos.paginator = this.paginator;
          this.eventos.sort = this.sort;
        })
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.eventos.filter = filterValue.trim().toLowerCase();
      }

      delete(id): void {
        this.eventoService.deleteEvento(id).subscribe((res) => {
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
        this.route.navigate(['/evento/edit/' + id])
      }

      details(id): void {
        this.route.navigate(['/evento/detail/' + id])
      }
}


@Component({
    selector     : 'evento-add',
    templateUrl  : './evento.add.component.html',
    styleUrls    : ['./evento.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EventoAddComponent implements OnInit
{

  public action: string = '';
  public srcResult = '';
  formFieldHelpers: string[] = [''];


  public evento: Evento = {
    id: null,
    titulo: '',
    user_id: 1,
    descripcion: '',
    lugar: '',
  };

  public imageShow: string = '';

  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
      type   : 'success',
      message: ''
  };

  constructor(
      public eventoService: EventoService,
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
      this.getEvento(this.router.snapshot.params.id);
    }
    else {
      this.action = 'Add';
    }
  }

  onFileChanged(event) {
    this.removerImagen();
    this.evento.img = event.target.files[0];
  }

  getEvento(id): void {
    this.eventoService.getEvento(id).subscribe((res) => {
      this.evento = res['data'];
      this.evento.fecha = moment(this.evento.fecha).format("YYYY-MM-DDTHH:mm");
      this.imageShow = AppSettings.URI_GENERAL + this.evento.imagen
      console.log(this.imageShow)
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontro el evento'
      };
      this.showAlert = true;
    };
  }

  listEventoesRoute(): void {
      this.route.navigate(['/evento']);
  }

  generateFinalForm(): any {
    const finalData = new FormData();
    if(this.evento.img){
      finalData.append('img', this.evento.img);
    }
    Object.keys(this.evento).forEach(key => {
      finalData.append(key, this.evento[key]);
    })
    return finalData;
  }

  removerImagen(): void {
    this.evento.img = null;
    this.evento.imagen = '';
  }

  saveEvento(): void {
    const finalForm = this.generateFinalForm();
    this.eventoService.saveEvento(finalForm).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/evento']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo guardar el registro'
      };
      this.showAlert = true;
    });
  }

  updateEvento(): void {
    const finalUpdateForm = this.generateFinalForm();
    this.eventoService.updateEvento(this.evento.id, this.evento).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se edito correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/evento']);
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
