import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { GestionCuestionarioService  } from './gestionCuestionario.service';
import { BancoService } from '../banco/banco.service';
import { CarreraService  } from './../carrera/carrera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FuseAlertType } from '@fuse/components/alert';
import { Cuestionario } from './cuestionario.model';
import * as moment from 'moment';
import { AppSettings } from '../../../core/settings/constants';
import { ApexOptions } from 'ng-apexcharts';
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexResponsive,
    ApexXAxis,
    ApexLegend,
    ApexFill
  } from "ng-apexcharts";


export type ChartOptions = {
series: ApexAxisChartSeries;
chart: ApexChart;
dataLabels: ApexDataLabels;
plotOptions: ApexPlotOptions;
responsive: ApexResponsive[];
xaxis: ApexXAxis;
legend: ApexLegend;
fill: ApexFill;
};
@Component({
    selector     : 'gestionCuestionario',
    templateUrl  : './gestionCuestionario.component.html',
    styleUrls    : ['./gestionCuestionario.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class GestionCuestionarioComponent implements OnInit
{
    public cuestionarios;
    public cuestionariosCount;
    public cuestionariosTableColumns: string[] = ['nombre', 'descripcion', 'tipo', 'privacidad','acciones'];

    constructor(
        public cuestionarioService: GestionCuestionarioService,
        private route: Router,
        private router: ActivatedRoute,
    ){

    }

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

    ngOnInit(): void {
        this.getList();
    }

    getList(): void {
        this.cuestionarioService.getGestionCuestionarios().subscribe((res) => {
          this.cuestionariosCount = res['data'].length;
          this.cuestionarios = new MatTableDataSource<any>(res['data']);
          this.cuestionarios.paginator = this.paginator;
          this.cuestionarios.sort = this.sort;
        })
    }

    details(id): void {
      this.route.navigate(['/gestionCuestionario/detail/' + id])
    }

    questions(id): void {
        this.route.navigate(['/gestionCuestionario/question/' + id])
    }

    delete(id): void {
      this.cuestionarioService.deleteCuestionario(id).subscribe((res) => {
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
      this.route.navigate(['/gestionCuestionario/edit/' + id])
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.cuestionarios.filter = filterValue.trim().toLowerCase();
    }
}


@Component({
    selector     : 'gestionCuestionario-graph',
    templateUrl  : './gestionCuestionario.graph.component.html',
    styleUrls    : ['./gestionCuestionario.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CuestionarioGraphComponent implements OnInit
{

    public action = '';
    public srcResult = '';
    formFieldHelpers: string[] = [''];
    public chartGithubIssues: ApexOptions = {};
    public chartOptions: Partial<ChartOptions>;
    public series;
    public data  = {
        "githubIssues": {
            "overview": {
                "this-week": {
                    "new-issues": 214,
                    "closed-issues": 75,
                    "fixed": 3,
                    "wont-fix": 4,
                    "re-opened": 8,
                    "needs-triage": 6
                },
                "last-week": {
                    "new-issues": 197,
                    "closed-issues": 72,
                    "fixed": 6,
                    "wont-fix": 11,
                    "re-opened": 6,
                    "needs-triage": 5
                }
            },
            "labels": [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],
            "series": {
                "this-week": [
                    {
                        "name": "New issues",
                        "type": "line",
                        "data": [
                            42,
                            28,
                            43,
                            34,
                            20,
                            25,
                            22
                        ]
                    },
                    {
                        "name": "Closed issues",
                        "type": "column",
                        "data": [
                            11,
                            10,
                            8,
                            11,
                            8,
                            10,
                            17
                        ]
                    }
                ],
                "last-week": [
                    {
                        "name": "New issues",
                        "type": "line",
                        "data": [
                            37,
                            32,
                            39,
                            27,
                            18,
                            24,
                            20
                        ]
                    },
                    {
                        "name": "Closed issues",
                        "type": "column",
                        "data": [
                            9,
                            8,
                            10,
                            12,
                            7,
                            11,
                            15
                        ]
                    }
                ]
            }
        },
        "taskDistribution": {
            "overview": {
                "this-week": {
                    "new": 594,
                    "completed": 287
                },
                "last-week": {
                    "new": 526,
                    "completed": 260
                }
            },
            "labels": [
                "API",
                "Backend",
                "Frontend",
                "Issues"
            ],
            "series": {
                "this-week": [
                    15,
                    20,
                    38,
                    27
                ],
                "last-week": [
                    19,
                    16,
                    42,
                    23
                ]
            }
        },
        "schedule": {
            "today": [
                {
                    "title": "Group Meeting",
                    "time": "in 32 minutes",
                    "location": "Conference room 1B"
                },
                {
                    "title": "Coffee Break",
                    "time": "10:30 AM"
                },
                {
                    "title": "Public Beta Release",
                    "time": "11:00 AM"
                },
                {
                    "title": "Lunch",
                    "time": "12:10 PM"
                },
                {
                    "title": "Dinner with David",
                    "time": "05:30 PM",
                    "location": "Magnolia"
                },
                {
                    "title": "Jane's Birthday Party",
                    "time": "07:30 PM",
                    "location": "Home"
                },
                {
                    "title": "Overseer's Retirement Party",
                    "time": "09:30 PM",
                    "location": "Overseer's room"
                }
            ],
            "tomorrow": [
                {
                    "title": "Marketing Meeting",
                    "time": "09:00 AM",
                    "location": "Conference room 1A"
                },
                {
                    "title": "Public Announcement",
                    "time": "11:00 AM"
                },
                {
                    "title": "Lunch",
                    "time": "12:10 PM"
                },
                {
                    "title": "Meeting with Beta Testers",
                    "time": "03:00 PM",
                    "location": "Conference room 2C"
                },
                {
                    "title": "Live Stream",
                    "time": "05:30 PM"
                },
                {
                    "title": "Release Party",
                    "time": "07:30 PM",
                    "location": "CEO's house"
                },
                {
                    "title": "CEO's Private Party",
                    "time": "09:30 PM",
                    "location": "CEO's Penthouse"
                }
            ]
        },
        "budgetDistribution": {
            "categories": [
                "Concept",
                "Design",
                "Development",
                "Extras",
                "Marketing"
            ],
            "series": [
                {
                    "name": "Budget",
                    "data": [
                        12,
                        20,
                        28,
                        15,
                        25
                    ]
                }
            ]
        },
        "weeklyExpenses": {
            "amount": 17663,
            "labels": [
                "15 Feb - 22 Feb",
                "23 Feb - 02 Mar",
                "03 Mar - 10 Mar",
                "11 Mar - 18 Mar",
                "19 Mar - 26 Mar",
                "27 Mar - 03 Apr"
            ],
            "series": [
                {
                    "name": "Expenses",
                    "data": [
                        4412,
                        4345,
                        4541,
                        4677,
                        4322,
                        4123
                    ]
                }
            ]
        },
        "monthlyExpenses": {
            "amount": 54663,
            "labels": [
                "03 Mar - 10 Mar",
                "11 Mar - 18 Mar",
                "19 Mar - 26 Mar",
                "27 Mar - 03 Apr"
            ],
            "series": [
                {
                    "name": "Expenses",
                    "data": [
                        15521,
                        15519,
                        15522,
                        15521
                    ]
                }
            ]
        },
        "yearlyExpenses": {
            "amount": 648813,
            "labels": [
                "14 Jan - 21 Jan",
                "22 Jan - 29 Jan",
                "30 Jan - 06 Feb",
                "07 Feb - 14 Feb",
                "15 Feb - 22 Feb",
                "23 Feb - 02 Mar",
                "03 Mar - 10 Mar",
                "11 Mar - 18 Mar",
                "19 Mar - 26 Mar",
                "27 Mar - 03 Apr"
            ],
            "series": [
                {
                    "name": "Expenses",
                    "data": [
                        45891,
                        45801,
                        45834,
                        45843,
                        45800,
                        45900,
                        45814,
                        45856,
                        45910,
                        45849
                    ]
                }
            ]
        },
        "budgetDetails": {
            "columns": [
                "type",
                "total",
                "expensesAmount",
                "expensesPercentage",
                "remainingAmount",
                "remainingPercentage"
            ],
            "rows": [
                {
                    "id": 1,
                    "type": "Concept",
                    "total": 14880,
                    "expensesAmount": 14000,
                    "expensesPercentage": 94.08,
                    "remainingAmount": 880,
                    "remainingPercentage": 5.92
                },
                {
                    "id": 2,
                    "type": "Design",
                    "total": 21080,
                    "expensesAmount": 17240.34,
                    "expensesPercentage": 81.78,
                    "remainingAmount": 3839.66,
                    "remainingPercentage": 18.22
                },
                {
                    "id": 3,
                    "type": "Development",
                    "total": 34720,
                    "expensesAmount": 3518,
                    "expensesPercentage": 10.13,
                    "remainingAmount": 31202,
                    "remainingPercentage": 89.87
                },
                {
                    "id": 4,
                    "type": "Extras",
                    "total": 18600,
                    "expensesAmount": 0,
                    "expensesPercentage": 0,
                    "remainingAmount": 18600,
                    "remainingPercentage": 100
                },
                {
                    "id": 5,
                    "type": "Marketing",
                    "total": 34720,
                    "expensesAmount": 19859.84,
                    "expensesPercentage": 57.2,
                    "remainingAmount": 14860.16,
                    "remainingPercentage": 42.8
                }
            ]
        },
        "teamMembers": [
            {
                "id": "2bfa2be5-7688-48d5-b5ac-dc0d9ac97f14",
                "avatar": "assets/images/avatars/female-10.jpg",
                "name": "Nadia Mcknight",
                "email": "nadiamcknight@mail.com",
                "phone": "+1-943-511-2203",
                "title": "Project Director"
            },
            {
                "id": "77a4383b-b5a5-4943-bc46-04c3431d1566",
                "avatar": "assets/images/avatars/male-19.jpg",
                "name": "Best Blackburn",
                "email": "blackburn.best@beadzza.me",
                "phone": "+1-814-498-3701",
                "title": "Senior Developer"
            },
            {
                "id": "8bb0f597-673a-47ca-8c77-2f83219cb9af",
                "avatar": "assets/images/avatars/male-14.jpg",
                "name": "Duncan Carver",
                "email": "duncancarver@mail.info",
                "phone": "+1-968-547-2111",
                "title": "Senior Developer"
            },
            {
                "id": "c318e31f-1d74-49c5-8dae-2bc5805e2fdb",
                "avatar": "assets/images/avatars/male-01.jpg",
                "name": "Martin Richards",
                "email": "martinrichards@mail.biz",
                "phone": "+1-902-500-2668",
                "title": "Junior Developer"
            },
            {
                "id": "0a8bc517-631a-4a93-aacc-000fa2e8294c",
                "avatar": "assets/images/avatars/female-20.jpg",
                "name": "Candice Munoz",
                "email": "candicemunoz@mail.co.uk",
                "phone": "+1-838-562-2769",
                "title": "Lead Designer"
            },
            {
                "id": "a4c9945a-757b-40b0-8942-d20e0543cabd",
                "avatar": "assets/images/avatars/female-01.jpg",
                "name": "Vickie Mosley",
                "email": "vickiemosley@mail.net",
                "phone": "+1-939-555-3054",
                "title": "Designer"
            },
            {
                "id": "b8258ccf-48b5-46a2-9c95-e0bd7580c645",
                "avatar": "assets/images/avatars/female-02.jpg",
                "name": "Tina Harris",
                "email": "tinaharris@mail.ca",
                "phone": "+1-933-464-2431",
                "title": "Designer"
            },
            {
                "id": "f004ea79-98fc-436c-9ba5-6cfe32fe583d",
                "avatar": "assets/images/avatars/male-02.jpg",
                "name": "Holt Manning",
                "email": "holtmanning@mail.org",
                "phone": "+1-822-531-2600",
                "title": "Marketing Manager"
            },
            {
                "id": "8b69fe2d-d7cc-4a3d-983d-559173e37d37",
                "avatar": "assets/images/avatars/female-03.jpg",
                "name": "Misty Ramsey",
                "email": "mistyramsey@mail.us",
                "phone": "+1-990-457-2106",
                "title": "Consultant"
            }
        ]
    }

    constructor(  public cuestionarioService: GestionCuestionarioService,
        private route: Router,
        private router: ActivatedRoute, ) {
        this.chartOptions = {
          series: [
            {
              name: "Repuesta A",
              data: [2, 1, 9, 5, 6, 1]
            },
            {
              name: "Repuesta B",
              data: [3, 4, 0, 2, 3, 1]
            },
            {
              name: "Repuesta C",
              data: [2, 2, 0, 1, 0, 1]
            },
            {
              name: "Repuesta D",
              data: [2, 2, 0, 1, 0, 6]
            }
          ],
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }
          ],
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          xaxis: {
            type: "category",
            categories: [
              "Pregunta 1",
              "Pregunta 2",
              "Pregunta 3",
              "Pregunta 4",
              "Pregunta 5",
              "Pregunta 6"
            ]
          },
          legend: {
            position: "right",
            offsetY: 40
          },
          fill: {
            opacity: 1
          }
        };
      }

    ngOnInit(): void {

        console.log("pantalla correcta")
        if(this.router.snapshot.routeConfig.path !== 'cuestionario/graph/:id'){

            if(this.router.snapshot.routeConfig.path === 'cuestionario/edit/:id') {
              this.action = 'Edit';
            }

            if(this.router.snapshot.routeConfig.path === 'cuestionario/detail/:id') {
              this.action = 'Detail';
            }
          }
          else {
            this.action = 'Graph';
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

    listCuestionariosRoute(): void {
        console.log("entra")
        this.route.navigate(['/cuestionario']);
    }
}

@Component({
    selector     : 'gestionCuestionario-add',
    templateUrl  : './gestionCuestionario.add.component.html',
    styleUrls    : ['./gestionCuestionario.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GestionCuestionarioAddComponent implements OnInit
{

  public action: string = '';
  public srcResult = '';
  formFieldHelpers: string[] = [''];


  public cuestionario: Cuestionario = {
    id: null,
    nombre: '',
    user_id: 1,
    descripcion: '',
    tipo: '',
    privacidad: '',
    objetivo: [],
    fecha_fin: new Date().toLocaleDateString('fr-CA'),
    fecha_inicio: new Date().toLocaleDateString('fr-CA'),
  };

  public carreras: [];

  public imageShow: string = '';

  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
      type   : 'success',
      message: ''
  };

  constructor(
      public gestionCuestionarioService: GestionCuestionarioService,
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
      this.getCuestionario(this.router.snapshot.params.id);
    }
    else {
      this.action = 'Add';
      this.cuestionario.tipo = 'cuestionario';
      this.cuestionario.objetivo = [];
      this.cuestionario.privacidad = 'publico';
    }

    this.carreraService.getCarreras().subscribe((res) => {
        this.carreras = res['data'];
    });
  }

  getCuestionario(id): void {
    this.gestionCuestionarioService.getGestionCuestionario(id).subscribe((res) => {
      this.cuestionario = res['data'];
      this.gestionCuestionarioService.getGestionCuestionarioCarreras(id).subscribe((res2) => {
        console.log(res2)
        this.cuestionario.objetivo = res2['data'];
      });
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontro el cuestionario'
      };
      this.showAlert = true;
    };
  }

  listGestionCuestionarioRoute(): void {
      this.route.navigate(['/gestionCuestionario']);
  }

  generateFinalForm(): any {

    if(this.cuestionario.privacidad !== 'publico_fecha'){
      this.cuestionario.fecha_fin = new Date().toLocaleDateString('fr-CA');
      this.cuestionario.fecha_inicio = new Date().toLocaleDateString('fr-CA');
    }
    const finalData = new FormData();
    Object.keys(this.cuestionario).forEach(key => {
      finalData.append(key, this.cuestionario[key]);
    })
    return finalData;
  }

  saveCuestionario(): void {
    const finalForm = this.generateFinalForm();
    this.gestionCuestionarioService.saveGestionCuestionarios(finalForm).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/gestionCuestionario']);
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo guardar el registro'
      };
      this.showAlert = true;
    });
  }

  sendCuestionario(): void {
    console.log("envio cuestionario");
  }

  updateCuestionario(): void {
    const finalForm2 = this.generateFinalForm();
    this.gestionCuestionarioService.updateCuestionario(this.router.snapshot.params.id, finalForm2).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/gestionCuestionario']);
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
    this.cuestionario.objetivo = [];
    Object.keys(this.carreras).forEach(key => {
      let carrareId = this.carreras[key].id;
      this.cuestionario.objetivo.push(carrareId)
    })
  }

  /*
  updateCuestionario(): void {
    const finalUpdateForm = this.generateFinalForm();
    console.log(finalUpdateForm);
    console.log(this.cuestionario);
    this.cuestionarioService.updateCuestionario(this.cuestionario.id, this.cuestionario).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se edito correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/cuestionario']);
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

@Component({
    selector     : 'gestionCuestionario-questions',
    templateUrl  : './gestionCuestionario.questions.component.html',
    styleUrls    : ['./gestionCuestionario.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GestionCuestionarioQuestionsComponent implements OnInit
{

  public action: string = '';
  public srcResult = '';
  formFieldHelpers: string[] = [''];

  public cuestionarioPreguntas;
  public opciones = ['Opción 1', 'Opción 2'];
  public opciones2 = ['Opción 1', 'Opción 2'];
  public allOpciones: any;
  public bancos;
  public showBancos = false;
  public bancoInit = 1;

  public cuestionario: Cuestionario = {
    id: null,
    nombre: '',
    user_id: 1,
    descripcion: '',
    tipo: '',
    privacidad: '',
    objetivo: [],
    fecha_fin: new Date().toLocaleDateString('fr-CA'),
    fecha_inicio: new Date().toLocaleDateString('fr-CA'),
  };

  public cuestionarioPregunta = {
    id: null,
    tipoPregunta_id: 1,
    pregunta: '',
    preguntaBanco: 0,
    numPregunta: 0,
    pregunta_id: null,
    cuestionario_id: this.router.snapshot.params.id,
    opciones: []
  };

  public carreras: [];

  public imageShow: string = '';
  public tipoPreguntas = [];

  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
      type   : 'success',
      message: ''
  };

  constructor(
      public gestionCuestionarioService: GestionCuestionarioService,
      public bancoService: BancoService,
      public carreraService: CarreraService,
      private route: Router,
      private router: ActivatedRoute,
  ){

  }

  ngOnInit(): void {
      this.getCuestionario(this.router.snapshot.params.id);
      this.getCuestionarioPreguntas(this.router.snapshot.params.id);
      this.getTipoPreguntas();
      this.getBancoList();
  }

  getCuestionario(id): void {
    this.gestionCuestionarioService.getGestionCuestionario(id).subscribe((res) => {
      this.cuestionario = res['data'];
      this.gestionCuestionarioService.getGestionCuestionarioCarreras(id).subscribe((res2) => {
        console.log(res2)
        this.cuestionario.objetivo = res2['data'];
      });
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontro el cuestionario'
      };
      this.showAlert = true;
    };
  }

  getCuestionarioPreguntas(id): void {
    this.gestionCuestionarioService.getPreguntasCuestionario(id).subscribe((res) => {
      this.cuestionarioPreguntas = res['data'];
      this.bancoService.getPreguntaOpciones().subscribe((res2) => {
        this.allOpciones = res2['data'];
        console.log("opciones")
        console.log(this.cuestionarioPreguntas)
        console.log(this.allOpciones)
        Object.keys(this.cuestionarioPreguntas).forEach(key => {
            this.cuestionarioPreguntas[key]['opciones'] = [];
            Object.keys(this.allOpciones).forEach(key2 => {
                if(this.cuestionarioPreguntas[key]['id'] == this.allOpciones[key2]['pregunta_id']){
                   this.cuestionarioPreguntas[key]['opciones'][this.cuestionarioPreguntas[key]['opciones'].length] = this.allOpciones[key2]['nombre'];
                }
            })
        });
      console.log(this.cuestionarioPreguntas)
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
        message: 'No se encontro el cuestionario'
      };
      this.showAlert = true;
    };
  }

  listGestionCuestionarioRoute(): void {
      this.route.navigate(['/gestionCuestionario']);
  }

  addOption(): any {
    let optionNum = this.opciones.length + 1;
    this.opciones[this.opciones.length] = "Opción " + optionNum;
  }

  generateFinalForm(): any {

    if(this.cuestionario.privacidad !== 'publico_fecha'){
      this.cuestionario.fecha_fin = new Date().toLocaleDateString('fr-CA');
      this.cuestionario.fecha_inicio = new Date().toLocaleDateString('fr-CA');
    }
    const finalData = new FormData();
    Object.keys(this.cuestionario).forEach(key => {
      finalData.append(key, this.cuestionario[key]);
    })
    return finalData;
  }

  saveCuestionario(): void {
    const finalForm = this.generateFinalFormPregunta();
    this.gestionCuestionarioService.saveCuestionarioPregunta(finalForm).subscribe((res) => {
        this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
        };
        this.showAlert = true;
        this.route.navigateByUrl('/gestionCuestionario', { skipLocationChange: true }).then(() => {
            this.route.navigate(['/gestionCuestionario/question/' + this.router.snapshot.params.id]);
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

    generateFinalFormPregunta(): any {
        const finalData = new FormData();
        if(this.cuestionarioPregunta['tipoPregunta_id'] == 1 || this.cuestionarioPregunta['tipoPregunta_id'] == 2){
            this.cuestionarioPregunta['opciones'] = this.opciones2;
        }
        Object.keys(this.cuestionarioPregunta).forEach(key => {
            finalData.append(key, this.cuestionarioPregunta[key]);
        })
        return finalData;
    }

  saveCuestionarioBanco(id): void {
    console.log("preguntas banco")
    this.bancoService.setCuestionarioBancoPreguntas(id, this.router.snapshot.params.id).subscribe((res) => {
        this.alert = {
        type   : 'success',
        message: 'Se guardo correctamente el registro'
        };
        this.showAlert = true;
        this.route.navigateByUrl('/gestionCuestionario', { skipLocationChange: true }).then(() => {
            this.route.navigate(['/gestionCuestionario/question/' + this.router.snapshot.params.id]);
        });
      }), (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se encontron las preguntas'
        };
        this.showAlert = true;
      };
  }

  showBancosFunc(): void {
    this.showBancos = !this.showBancos;
  }

  deletePregunta(id): any{
    this.gestionCuestionarioService.deleteCuestionarioPregunta(id).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: 'Se borro correctamente el registro'
        };
        this.showAlert = true;
        this.route.navigateByUrl('/gestionCuestionario', { skipLocationChange: true }).then(() => {
            this.route.navigate(['/gestionCuestionario/question/' + this.router.snapshot.params.id]);
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

  seleccionarCarreras(): void {
    this.cuestionario.objetivo = [];
    Object.keys(this.carreras).forEach(key => {
      let carrareId = this.carreras[key].id;
      this.cuestionario.objetivo.push(carrareId)
    })
  }

  getTipoPreguntas(): void {
    this.bancoService.getTipoPregunta().subscribe((res) => {
      this.tipoPreguntas = res['data'];
      console.log(this.tipoPreguntas)
    }), (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se encontraron los tipos de preguntas'
      };
      this.showAlert = true;
    };
  }

  getBancoList(): void {
    this.bancoService.getBancos().subscribe((res) => {
      this.bancos= res['data'];
    })
  }

  /*
  updateCuestionario(): void {
    const finalUpdateForm = this.generateFinalForm();
    console.log(finalUpdateForm);
    console.log(this.cuestionario);
    this.cuestionarioService.updateCuestionario(this.cuestionario.id, this.cuestionario).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se edito correctamente el registro'
      };
      this.showAlert = true;
      this.route.navigate(['/cuestionario']);
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

