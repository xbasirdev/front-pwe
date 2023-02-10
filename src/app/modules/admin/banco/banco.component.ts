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
  public bancoPreguntas;
  public opciones = ['Opción 1', 'Opción 2'];
  public opciones2 = ['Opción 1', 'Opción 2'];
  public allOpciones: any;
  formFieldHelpers: string[] = [''];

  public banco = {
    id: null,
    nombre: '',
    descripcion: '',
  };


  public bancoPregunta = {
    id: null,
    tipoPregunta_id: 1,
    pregunta: '',
    preguntaBanco: 1,
    numPregunta: 0,
    pregunta_id: null,
    banco_id: this.router.snapshot.params.id,
    opciones: []
  };

  public tipoPreguntas = [];


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
      this.getBancoPreguntas(this.router.snapshot.params.id);
      this.getTipoPreguntas();

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

  getBancoPreguntas(id): void {
    this.bancoService.getBancoPreguntas(id).subscribe((res) => {
      this.bancoPreguntas = res['data'];
      this.bancoService.getPreguntaOpciones().subscribe((res2) => {
        this.allOpciones = res2['data'];
        Object.keys(this.bancoPreguntas).forEach(key => {
            this.bancoPreguntas[key]['opciones'] = [];
            Object.keys(this.allOpciones).forEach(key2 => {
                if(this.bancoPreguntas[key]['pregunta_id'] == this.allOpciones[key2]['pregunta_id']){
                   this.bancoPreguntas[key]['opciones'][this.bancoPreguntas[key]['opciones'].length] = this.allOpciones[key2]['nombre'];
                }
            })
        });
      console.log(this.bancoPreguntas)
      }), (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se encontron las opciones'
        };
        this.showAlert = true;
      };
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontron las preguntas'
      };
      this.showAlert = true;
    };
  }

  getTipoPreguntas(): void {
    this.bancoService.getTipoPregunta().subscribe((res) => {
      this.tipoPreguntas = res['data'];
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontraron los tipos de preguntas'
      };
      this.showAlert = true;
    };
  }

  addOption(): any {
    let optionNum = this.opciones.length + 1;
    this.opciones[this.opciones.length] = "Opción " + optionNum;
  }

  deleteOption(num): any{
    this.opciones.splice(num, 1);
  }

  deletePregunta(id): any{
    this.bancoService.deleteBancoPregunta(id).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: 'Se borro correctamente el registro'
        };
        this.showAlert = true;
        this.route.navigateByUrl('/banco', { skipLocationChange: true }).then(() => {
            this.route.navigate(['/banco/preguntas/' + this.router.snapshot.params.id]);
        });
      }, (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se pudo borrar el registro'
        };
        this.showAlert = true;
      });
  }

    generateFinalFormPregunta(): any {
        const finalData = new FormData();
        if(this.bancoPregunta['tipoPregunta_id'] == 1 || this.bancoPregunta['tipoPregunta_id'] == 2){
            this.bancoPregunta['opciones'] = this.opciones2;
        }
        Object.keys(this.bancoPregunta).forEach(key => {
            finalData.append(key, this.bancoPregunta[key]);
        })
        return finalData;
    }


    savePreguntaBanco(): void {
        const finalForm = this.generateFinalFormPregunta();
        this.bancoService.saveBancoPregunta(finalForm).subscribe((res) => {
            this.alert = {
            type   : 'success',
            message: 'Se guardo correctamente el registro'
            };
            this.showAlert = true;
            this.route.navigateByUrl('/banco', { skipLocationChange: true }).then(() => {
                this.route.navigate(['/banco/preguntas/' + this.router.snapshot.params.id]);
            });
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
