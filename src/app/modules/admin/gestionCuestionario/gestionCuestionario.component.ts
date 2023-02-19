import { Component, OnInit, ViewEncapsulation, Inject, Input,ElementRef, ViewChild  } from '@angular/core';
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
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAnimations } from '@fuse/animations';
import { saveAs } from 'file-saver';
import {formatDate} from '@angular/common';

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

    redirectGraph(id): void {
        this.route.navigate(['/gestionCuestionario/graph/' + id])
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
    public chartOptions: any;
    public series;

    public cuestionarioPreguntas;
    public cuestionarioRespuestas;
    public opciones = ['Opción 1', 'Opción 2'];
    public opciones2 = ['Opción 1', 'Opción 2'];
    public allOpciones: any;
    public bancos;
    public showBancos = false;
    public bancoInit = 1;
    public preguntaSelect = "Todas";
    public completeTotal;
    public completeMonth;
    public completeToday;
    public showChart = false;
    public chartTitle = '';
    public generatePregunta: any = null;

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

    constructor(  public cuestionarioService: GestionCuestionarioService,
        private route: Router,
        private router: ActivatedRoute,
        public gestionCuestionarioService: GestionCuestionarioService,
        public bancoService: BancoService,
        public dialog: MatDialog ) {
        this.chartOptions = {
          series: [
            {
              name: "Repuesta A",
              data: [1, 2, 4, 0 , 0, 0]
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

    public chartSelect = 'barra';
    public chartSelectOptions = ['barra', 'dispersion']

    ngOnInit(): void {
        this.action = 'Graph';
        this.getCuestionario(this.router.snapshot.params.id);
        this.getCuestionarioPreguntas(this.router.snapshot.params.id);
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

    openExportRDialogBtn(){
        this.openExportRDialog(this.router.snapshot.params.id)
    }

    openExportRDialog(id) {
      const exportDialog = this.dialog.open(CuestionarioExportRComponent, {
        data: { id }
      });
      exportDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    openExportDialogBtn(){
        this.openExportDialog(this.router.snapshot.params.id, this.completeTotal, this.completeMonth, this.completeToday)
    }

    openExportDialog(id, total, month, today) {
      const exportDialog = this.dialog.open(CuestionarioExportDComponent, {
        data: { id, total, month, today}
      });
      exportDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    listCuestionariosRoute(): void {
        this.route.navigate(['/gestionCuestionario']);
    }

    getCuestionario(id): void {
        this.gestionCuestionarioService.getGestionCuestionario(id).subscribe((res) => {
          this.cuestionario = res['data'];
          this.gestionCuestionarioService.getGestionCuestionarioCarreras(id).subscribe((res2) => {
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
            Object.keys(this.cuestionarioPreguntas).forEach(key => {
                this.cuestionarioPreguntas[key]['opciones'] = [];
                Object.keys(this.allOpciones).forEach(key2 => {
                    if(this.cuestionarioPreguntas[key]['id'] == this.allOpciones[key2]['pregunta_id']){
                       this.cuestionarioPreguntas[key]['opciones'][this.cuestionarioPreguntas[key]['opciones'].length] = this.allOpciones[key2]['nombre'];
                    }
                })
            });
          this.getCuestionarioRespuestas();
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

      getCuestionarioRespuestas(): void {
        this.gestionCuestionarioService.getRespuestasCuestionario("").subscribe((res) => {
            this.cuestionarioRespuestas = res;
            let currentDate = new Date();
            let options = { year: 'numeric', month: 'long', day: 'numeric' };
            let dataSet = false;
            let currentDateString = currentDate.toLocaleDateString("en-US", options)
            Object.keys(this.cuestionarioPreguntas).forEach(key => {
                this.cuestionarioPreguntas[key]['respuestas'] = [];
                if(!dataSet){
                    this.completeMonth = 0;
                    this.completeTotal = 0;
                    this.completeToday = 0;
                }

                Object.keys(this.cuestionarioRespuestas).forEach(key2 => {
                    if(this.cuestionarioPreguntas[key]['id'] == this.cuestionarioRespuestas[key2]['pregunta_id']){
                        this.cuestionarioPreguntas[key]['respuestas'][this.cuestionarioPreguntas[key]['respuestas'].length] = this.cuestionarioRespuestas[key2];
                        if(!dataSet){
                            if(currentDateString.substring(0, 3) == this.cuestionarioRespuestas[key2]['created_at'].substring(8, 11)){
                                this.completeMonth++;
                            }
                            let respDay = parseInt(this.cuestionarioRespuestas[key2]['created_at'].substring(5, 7));
                            if(currentDate.getDate() == respDay){
                                this.completeToday++;
                            }

                            this.completeTotal++;
                        }
                    }
                })
                dataSet = true;
            });
            console.log("cuestionario preguntas final", this.cuestionarioPreguntas);
        }), (error) => {
          console.log(error);
          this.alert = {
            type   : 'error',
            message: 'No se encontraron las respuestas'
          };
          this.showAlert = true;
        };
      }

      public generateChart(): void{
        if(this.generatePregunta == null){
            if(this.chartSelect == "barra"){
                this.chartTitle = "Grafica de todas las preguntas";
                let preguntasGeneral = [];
                let dataGeneral = [];
                let opcionesMax = 0;
                for(let i = 0; i < this.cuestionarioPreguntas.length; i++){
                    preguntasGeneral[i] = "Pregunta - " + (i + 1);
                    if(this.cuestionarioPreguntas[i]['opciones'].length > opcionesMax){
                        opcionesMax = this.cuestionarioPreguntas[i]['opciones'].length
                    }
                }
                let dataInit = [];
                for(let i = 0; i < opcionesMax; i++){
                    dataInit[i] = []
                    for(let j = 0; j < this.cuestionarioPreguntas.length; j++){
                        dataInit[i][j] = 0;
                    }
                }

                console.log("data", dataInit)
                /*
                for(let i = 0; i < opcionesMax; i++){
                    dataInit[i] = []
                    for(let j = 0; j < this.cuestionarioPreguntas.length; j++){
                        if(this.cuestionarioPreguntas[j]['opciones'].length > 0 && this.cuestionarioPreguntas[j]['opciones'][0] != ''){
                            console.log("con esta pregunta entra", j)
                            let indexOpt = 0;
                            Object.keys(this.cuestionarioPreguntas[j]['opciones']).forEach((key, index) => {
                                let dataVal = 0;
                                Object.keys(this.cuestionarioPreguntas[j]['respuestas']).forEach((key2) => {
                                    if(this.cuestionarioPreguntas[j]['respuestas'][key2]['respuesta'].includes(this.cuestionarioPreguntas[j]['opciones'][key])){
                                        console.log("si cumple")
                                        console.log("valida")
                                        console.log(this.cuestionarioPreguntas[j]['respuestas'][key2]['respuesta'])
                                        console.log(this.cuestionarioPreguntas[j]['opciones'][key])
                                        dataVal ++;
                                    }
                                });
                                dataInit[i][j] = dataVal;
                            });
                        }
                    }
                }*/

                Object.keys(this.cuestionarioPreguntas).forEach((key, index) => {
                    Object.keys(this.cuestionarioPreguntas[key]['opciones']).forEach((key2, index2) => {
                        Object.keys(this.cuestionarioPreguntas[key]['respuestas']).forEach((key3, index3) => {
                            if(this.cuestionarioPreguntas[key]['opciones'][key2].includes(this.cuestionarioPreguntas[key]['respuestas'][key3]['respuesta'])){
                                dataInit[index2][index] =  dataInit[index2][index] + 1;
                            }
                        })
                    });
                });

                console.log("data", dataInit)
                let finalSerie = [];
                for(let i = 0; i < opcionesMax; i++){
                    let serieData = {
                        name: "Opcion " + (i + 1) ,
                        data: dataInit[i]
                    }
                    finalSerie[finalSerie.length] = serieData;
                }

                this.chartOptions = {
                    series: finalSerie,
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
                      categories: preguntasGeneral
                    },
                    legend: {
                      position: "right",
                      offsetY: 40
                    },
                    fill: {
                      opacity: 1
                    }
                  };
                this.showChart = true;
            }else if(this.chartSelect == "dispersion"){
                this.chartTitle = "Grafica de todas las preguntas";
                this.showChart = true;
            }
        }else{
            if(this.chartSelect == "pie"){
                if(this.generatePregunta['nombre'] == "rango"){
                    this.generatePregunta['opciones'] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
                    let arrayOptions = []
                    for(let i = 0; i < this.generatePregunta['opciones'].length; i++){
                        arrayOptions[i] = 0;
                    }

                    Object.keys(this.generatePregunta['respuestas']).forEach(key => {
                        let indexOpt = 0;
                        Object.keys(this.generatePregunta['opciones']).forEach((key2, index) => {
                            if(this.generatePregunta['opciones'][key2].includes(this.generatePregunta['respuestas'][key]['respuesta'])){
                                arrayOptions[index] = arrayOptions[index] + 1;
                            }
                        });
                    });
                    this.chartTitle = 'Pregunta: ' + this.generatePregunta['pregunta'] + ' - Pregunta tipo: ' + this.generatePregunta['nombre'] ;
                    let newChartData = arrayOptions;
                    let newType = {
                        width: 380,
                        type: "pie"
                    }
                    let newChartAxis = this.generatePregunta['opciones'];
                    this.chartOptions['chart'] = newType;
                    this.chartOptions['series'] = newChartData;
                    this.chartOptions['xaxis']['categories'] = newChartAxis;
                    this.chartOptions['labels'] = newChartAxis;
                    this.showChart = true;
                }else{
                    let arrayOptions = []
                    for(let i = 0; i < this.generatePregunta['opciones'].length; i++){
                        arrayOptions[i] = 0;
                    }

                    Object.keys(this.generatePregunta['respuestas']).forEach(key => {
                        let indexOpt = 0;
                        Object.keys(this.generatePregunta['opciones']).forEach((key2, index) => {
                            if(this.generatePregunta['opciones'][key2].includes(this.generatePregunta['respuestas'][key]['respuesta'])){
                                arrayOptions[index] = arrayOptions[index] + 1;
                            }
                        });
                    });
                    this.chartTitle = 'Pregunta: ' + this.generatePregunta['pregunta'] + ' - Pregunta tipo: ' + this.generatePregunta['nombre'] ;
                    let newChartData = arrayOptions;
                    let newType = {
                        width: 380,
                        type: "pie"
                    }
                    let newChartAxis = this.generatePregunta['opciones'];
                    this.chartOptions['chart'] = newType;
                    this.chartOptions['series'] = newChartData;
                    this.chartOptions['xaxis']['categories'] = newChartAxis;
                    this.chartOptions['labels'] = newChartAxis;
                    this.showChart = true;
                }
            }else if(this.chartSelect == 'linea'){
                let arrayOptions = []
                let arrayData = []
                this.chartTitle = 'Pregunta: ' + this.generatePregunta['pregunta'] + ' - Pregunta tipo: ' + this.generatePregunta['nombre'] ;
                for(let i = 0; i < this.generatePregunta['respuestas'].length; i++){
                    arrayOptions[i] = 'E' + (i + 1);
                    arrayData[i] = parseInt(this.generatePregunta['respuestas'][i]['respuesta']);
                }

                this.chartOptions = {
                    series: [
                      {
                        name: "respuesta",
                        data: arrayData
                      }
                    ],
                    chart: {
                      height: 350,
                      type: "line",
                      zoom: {
                        enabled: false
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      curve: "straight"
                    },
                    grid: {
                      row: {
                        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                        opacity: 0.5
                      }
                    },
                    xaxis: {
                      categories: arrayOptions
                    }
                  };
                  console.log(arrayOptions);
                  console.log(arrayData);
                  console.log(this.generatePregunta)
                  this.showChart = true;
            }
        }
      }

      public onChangePregunta(id): void{
        console.log("id", id)

        if(id == 'Todas'){
            this.chartSelectOptions = ['barra', 'dispersion']
            this.generatePregunta = null;
        }

        Object.keys(this.cuestionarioPreguntas).forEach(key => {
            if(this.cuestionarioPreguntas[key]['pregunta'] == id){
                if(this.cuestionarioPreguntas[key]['nombre'] == 'seleccion' || this.cuestionarioPreguntas[key]['nombre'] == 'multiple' || this.cuestionarioPreguntas[key]['nombre'] == 'rango'){
                    this.chartSelectOptions = ['barra', 'pie'];
                    this.generatePregunta = this.cuestionarioPreguntas[key];
                }
                if(this.cuestionarioPreguntas[key]['nombre'] == 'numerica'){
                    this.chartSelectOptions = ['linea'];
                    this.generatePregunta = this.cuestionarioPreguntas[key];
                }
                if(this.cuestionarioPreguntas[key]['nombre'] == 'texto'){
                    this.chartSelectOptions = []
                    this.generatePregunta = this.cuestionarioPreguntas[key];
                }
            }
        });

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
        Object.keys(this.cuestionarioPreguntas).forEach(key => {
            this.cuestionarioPreguntas[key]['opciones'] = [];
            Object.keys(this.allOpciones).forEach(key2 => {
                if(this.cuestionarioPreguntas[key]['id'] == this.allOpciones[key2]['pregunta_id']){
                   this.cuestionarioPreguntas[key]['opciones'][this.cuestionarioPreguntas[key]['opciones'].length] = this.allOpciones[key2]['nombre'];
                }
            })
        });
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


/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'exportar-cuestionario-r',
  templateUrl: 'gestionCuestionario.export.component.html',
  animations   : FuseAnimations
})

export class CuestionarioExportRComponent {

  export_type: string;
  types: string[] = ['xlsx', 'xls', 'csv'];
  showAlert: boolean = false;
  title: string ="respuestas";
  alert: { type: FuseAlertType, message: string } = {
    type   : 'success',
    message: ''
  };
  constructor(  public gestionCuestionarioService: GestionCuestionarioService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    console.log(data)
  }

  export(): void{
    if( this.export_type == undefined){
      this.alert = {
        type   : 'error',
        message: "Seleccione un formato"
      };
      this.showAlert = true;
      return;
    }

    this.gestionCuestionarioService.exportR(this.data['id'], {'base_format':this.export_type}).subscribe((res) => {
      const blob = new Blob([res.body], { type: res.headers.get('content-type') });
      let date = formatDate(new Date(), 'yyyyMMddhsm', 'en');
      const fileName ="cuestionarios-"+date+"."+this.export_type;
      const file = new File([blob], fileName, { type: res.headers.get('content-type') });
      saveAs(file);
        this.alert = {
          type   : 'success',
          message: 'archivo exportado correctamente'
        };
        this.showAlert = true;
      }, (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se pudo exportar el registro'
        };
        this.showAlert = true;
      });
  }

}

@Component({
  selector: 'exportar-cuestionario-d',
  templateUrl: 'gestionCuestionario.export.component.html',
  animations   : FuseAnimations
})

export class CuestionarioExportDComponent {
  title: string = "datos estadisticos";
  export_type: string;
  types: string[] = ['xlsx', 'xls', 'csv'];
  showAlert: boolean = false;
  alert: { type: FuseAlertType, message: string } = {
    type   : 'success',
    message: ''
  };
  constructor(  public gestionCuestionarioService: GestionCuestionarioService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  export(): void{
    if( this.export_type == undefined){
      this.alert = {
        type   : 'error',
        message: "Seleccione un formato"
      };
      this.showAlert = true;
      return;
    }

    this.gestionCuestionarioService.exportD(this.data['id'], {'base_format':this.export_type, 'total': this.data['total'],'total_dia': this.data['today'],'total_mes': this.data['month']}).subscribe((res) => {
      const blob = new Blob([res.body], { type: res.headers.get('content-type') });
      let date = formatDate(new Date(), 'yyyyMMddhsm', 'en');
      const fileName ="cuestionarios-"+date+"."+this.export_type;
      const file = new File([blob], fileName, { type: res.headers.get('content-type') });
      console.log(res);
        saveAs(file);
        this.alert = {
          type   : 'success',
          message: 'archivo exportado correctamente'
        };
        this.showAlert = true;
      }, (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'No se pudo exportar el registro'
        };
        this.showAlert = true;
      });
  }

}

export interface DialogData {}

