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

    getList(): void {
      this.bancoService.getBancos().subscribe((res) => {
        this.bancosCount = res['data'].length;
        this.bancos = new MatTableDataSource<any>(res['data']);
        this.bancos.paginator = this.paginator;
        this.bancos.sort = this.sort;
      })
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

    applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value;
      this.bancos.filter = filterValue.trim().toLowerCase();
    }

    editBanco(id): void {
      this.route.navigate(['/banco/edit/' + id])
    }

    gestionarPreguntasBanco(id): void {
      this.route.navigate(['/banco/preguntas/' + id])
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

    public banco = {    
      id: null,
      nombre: '',
      descripcion: '',
    };

    showAlert: boolean = false;
    alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };

    constructor(
        public bancoService: BancoService,
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
            this.getBanco(this.router.snapshot.params.id);
          }
          else {
            this.action = 'Add';
          }
    }

    listBancoRoute(): void {
        this.route.navigate(['/banco']);
    }
    
    getBanco(id): void {
    this.bancoService.getBanco(id).subscribe((res) => {
      this.banco = res['data'];
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontro el banco'
      };
      this.showAlert = true;
    };
  }

  generateFinalForm(): any {
    const finalData = new FormData();
    Object.keys(this.banco).forEach(key => {
      finalData.append(key, this.banco[key]);
    })
    return finalData;
  }
  

  saveBanco(): void {
    const finalForm = this.generateFinalForm();
    this.bancoService.saveBanco(finalForm).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/banco']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo guardar el registro'
      };
      this.showAlert = true;
    });
  }

  updateBanco(): void {
    const finalUpdateForm = this.generateFinalForm();
    console.log(finalUpdateForm);
    console.log(this.banco);
    this.bancoService.updateBanco(this.banco.id, this.banco).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se edito correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/banco']);
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

@Component({
  selector     : 'banco-questions',
  templateUrl  : './banco.questions.component.html',
  styleUrls    : ['./banco.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BancoQuestionsComponent implements OnInit
{

  public action = ''; 
  public srcResult = ''; 
  formFieldHelpers: string[] = [''];

  public banco = {    
    id: null,
    nombre: '',
    descripcion: '',
  };

  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
      type   : 'success',
      message: ''
  };

  constructor(
      public bancoService: BancoService,
      private route: Router,
      private router: ActivatedRoute, 
  ){
   
  }

  ngOnInit(): void {
      this.getBanco(this.router.snapshot.params.id);
  }

  listBancoRoute(): void {
      this.route.navigate(['/banco']);
  }
  
  getBanco(id): void {
  this.bancoService.getBanco(id).subscribe((res) => {
    this.banco = res['data'];
  }), (error) => {
    console.log(error);
    this.alert = {
      type   : 'error',
      message: 'No se encontro el banco'
    };
    this.showAlert = true;
  };
}

generateFinalForm(): any {
  const finalData = new FormData();
  Object.keys(this.banco).forEach(key => {
    finalData.append(key, this.banco[key]);
  })
  return finalData;
}


saveBanco(): void {
  const finalForm = this.generateFinalForm();
  this.bancoService.saveBanco(finalForm).subscribe((res) => {
    this.alert = {
      type   : 'success',
      message: 'Se guardo correctamente el registro'
    };
    this.showAlert = true;
    this.route.navigate(['/banco']);
  }, (error) => {
    console.log(error);
    this.alert = {
      type   : 'error',
      message: 'No se pudo guardar el registro'
    };
    this.showAlert = true;
  });
}

updateBanco(): void {
  const finalUpdateForm = this.generateFinalForm();
  console.log(finalUpdateForm);
  console.log(this.banco);
  this.bancoService.updateBanco(this.banco.id, this.banco).subscribe((res) => {
    this.alert = {
      type   : 'success',
      message: 'Se edito correctamente el registro'
    };
    this.showAlert = true;
    this.route.navigate(['/banco']);
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