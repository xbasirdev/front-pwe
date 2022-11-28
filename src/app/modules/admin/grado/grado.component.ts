import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { GradoService  } from './grado.service';
import { FuseAlertType } from '@fuse/components/alert';
import { Grado } from './grado.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
    selector     : 'grado',
    templateUrl  : './grado.component.html',
    styleUrls    : ['./grado.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GradoComponent implements OnInit
{
    public grados;
    public gradosCount;
    public gradosTableColumns: string[] = ['titulo', 'descripcion', 'fecha', 'acciones'];
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
        public gradoService: GradoService,
        private route: Router,
        private router: ActivatedRoute
    ){

    }

    ngOnInit(): void {
      this.getList();
    }

    getList(): void {
      this.gradoService.getGrados().subscribe((res) => {
        this.gradosCount = res['data'].length;
        this.grados = new MatTableDataSource<any>(res['data']);
        this.grados.paginator = this.paginator;
        this.grados.sort = this.sort;
      })
    }

    applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value;
      this.grados.filter = filterValue.trim().toLowerCase();
    }

    delete(id): void {
      this.gradoService.deleteGrado(id).subscribe((res) => {
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
      this.route.navigate(['/grado/edit/' + id])
    }

    details(id): void {
      this.route.navigate(['/grado/detail/' + id])
    }
}

@Component({
    selector     : 'grado-add',
    templateUrl  : './grado.add.component.html',
    styleUrls    : ['./grado.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GradoAddComponent implements OnInit
{

  public action: string = '';
  public srcResult = '';
  formFieldHelpers: string[] = [''];


  public grado: Grado = {
    id: null,
    titulo: '',
    user_id: 1,
    descripcion: ''
  };

  public imageShow: string = '';

  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
      type   : 'success',
      message: ''
  };

  constructor(
      public gradoService: GradoService,
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
      this.getGrado(this.router.snapshot.params.id);
    }
    else {
      this.action = 'Add';
    }
  }

  getGrado(id): void {
    this.gradoService.getGrado(id).subscribe((res) => {
      this.grado = res['data'];
      this.grado.fecha = moment(this.grado.fecha).format("YYYY-MM-DD");
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontro la grado Deportiva'
      };
      this.showAlert = true;
    };
  }

  listGradoesRoute(): void {
      this.route.navigate(['/grado']);
  }

  generateFinalForm(): any {
    const finalData = new FormData();
    Object.keys(this.grado).forEach(key => {
      finalData.append(key, this.grado[key]);
    })
    return finalData;
  }

  saveGrado(): void {
    const finalForm = this.generateFinalForm();
    this.gradoService.saveGrado(finalForm).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/grado']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo guardar el registro'
      };
      this.showAlert = true;
    });
  }

  updateGrado(): void {
    const finalUpdateForm = this.generateFinalForm();
    console.log(finalUpdateForm);
    console.log(this.grado);
    this.gradoService.updateGrado(this.grado.id, this.grado).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se edito correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/grado']);
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
