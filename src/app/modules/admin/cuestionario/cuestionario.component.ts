import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CuestionarioService  } from './cuestionario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector     : 'cuestionario',
    templateUrl  : './cuestionario.component.html',
    styleUrls    : ['./cuestionario.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CuestionarioComponent implements OnInit
{
    public cuestionarios;
    public cuestionariosIncompletos;
    public cuestionariosFinal;
    public cuestionariosCount;
    public cuestionariosTableColumns: string[] = ['titulo', 'descripcion', 'deporte', 'lugar', 'fecha', 'acciones'];
    public roleId = localStorage.getItem('role') ?? '';
    public userId = localStorage.getItem('userID') ?? '';
    public carreraEgresado: number = null;
    public showCuestionarios = false;

    constructor(
        public cuestionarioService: CuestionarioService,
        private route: Router,
        private router: ActivatedRoute,
    ){
        this.cuestionarioService.getEgresado(this.userId).subscribe((res) => {
            this.carreraEgresado = res['data'][0]['carrera_id'];
        })
    }

    ngOnInit(): void {
        this.cuestionarioService.getCuestionarios().subscribe((res) => {
            this.cuestionarioService.getObjetivoCuestionario().subscribe((res2) => {
                console.log(res2)
                this.cuestionarios = res['data'];
                Object.keys(this.cuestionarios).forEach(key => {
                    this.cuestionarios[key]['show'] = false;
                    Object.keys(res2['data']).forEach(key2 => {
                        if(this.cuestionarios[key]['id'] == res2['data'][key2]['cuestionario_id']){
                            if(res2['data'][key2]['carrera_id'] == this.carreraEgresado){
                                this.cuestionarios[key]['show'] = true;
                            }
                        }
                    });
                    if(this.cuestionarios[key]['show'] == true && this.cuestionarios[key]['privacidad'] == 'publico_fecha'){
                        console.log("este es rango fecha");
                        let current_date = new Date();
                        let start_date = new Date(this.cuestionarios[key]['fecha_inicio']);
                        let end_date = new Date(this.cuestionarios[key]['fecha_fin']);
                        if(start_date.getTime() < end_date.getTime()){
                            if(start_date.getTime() < current_date.getTime() && end_date.getTime() > current_date.getTime()){
                                this.cuestionarios[key]['show'] = true;
                            } else{
                                this.cuestionarios[key]['show'] = false;
                            }
                        }
                    }
                })
                this.cuestionarioService.getCuestionariosRespuesta().subscribe((res3) => {
                    console.log(res3)
                    console.log(this.cuestionarios)
                    this.showCuestionarios = true;
                })
            });
        })
    }

    filterByCategory(event): void {
      console.log("entra")
      this.route.navigate(['/cuestionario']);
    }

    toggleCompleted(event): void {
      console.log("entra")
      this.route.navigate(['/cuestionario']);
    }

    redirectAnswer(id): void {
        //console.log("id", id)
        this.route.navigate(['/cuestionario/responder/' + id])
    }
}


@Component({
    selector     : 'cuestionario-add',
    templateUrl  : './cuestionario.add.component.html',
    styleUrls    : ['./cuestionario.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CuestionarioAddComponent implements OnInit
{

    public action = '';
    public srcResult = '';
    formFieldHelpers: string[] = [''];

    constructor(
        public cuestionarioService: CuestionarioService,
        private route: Router,
        private router: ActivatedRoute,
    ){

    }

    ngOnInit(): void {
        console.log("pantalla correcta")
        if(this.router.snapshot.routeConfig.path !== 'cuestionario/create'){

            if(this.router.snapshot.routeConfig.path === 'cuestionario/edit/:id') {
              this.action = 'Edit';
            }

            if(this.router.snapshot.routeConfig.path === 'cuestionario/detail/:id') {
              this.action = 'Detail';
            }
          }
          else {
            this.action = 'Add';
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
  selector     : 'cuestionario-answer',
  templateUrl  : './cuestionario.answer.component.html',
  styleUrls    : ['./cuestionario.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CuestionarioAnswerComponent implements OnInit
{

  public action = '';
  public srcResult = '';
  public cuestionario: any;
  public cuestionarioPreguntas: any;
  public opciones: any;
  public loaded = false;
  public respuestas = [];
  public userId = localStorage.getItem('userID') ?? '';
  formFieldHelpers: string[] = [''];

  constructor(
      public cuestionarioService: CuestionarioService,
      private route: Router,
      private router: ActivatedRoute,
  ){

  }

  ngOnInit(): void {
    console.log("pantalla correcta")
    this.cuestionarioService.getCuestionario(this.router.snapshot.params.id).subscribe((res) => {
        this.cuestionario = res['data'];
        console.log(this.cuestionario)
        this.cuestionarioService.getCuestionarioPregunta(this.router.snapshot.params.id).subscribe((res2) => {
            this.cuestionarioPreguntas = res2['data'];
            console.log(this.cuestionarioPreguntas)
            this.cuestionarioService.getPreguntaOpciones().subscribe((res3) => {
                this.opciones = res3['data'];
                let i = 0;
                Object.keys(this.cuestionarioPreguntas).forEach(key => {
                    this.cuestionarioPreguntas[key]['opciones'] = [];
                    this.respuestas[i] = '';
                    i++;
                    Object.keys(this.opciones).forEach(key2 => {
                        if(this.cuestionarioPreguntas[key]['id'] == this.opciones[key2]['pregunta_id']){
                        this.cuestionarioPreguntas[key]['opciones'][this.cuestionarioPreguntas[key]['opciones'].length] = this.opciones[key2]['nombre'];
                        }
                    });
                })
                this.loaded = true;
            });
        });
    });
  }

  setText(index, answer): void {
    this.respuestas[index] = answer;
  }

  setNumber(index, answer): void {
    this.respuestas[index] = answer;
  }

  setMultiple(index, answer): void {
    if(this.respuestas[index] == ''){
        this.respuestas[index] = [];
        this.respuestas[index][0] = answer;
    }else{
        let newValue = true;
        for(let i = 0; i <  this.respuestas[index].length; i++){
            if(this.respuestas[index][i] == answer){
                this.respuestas[index].splice(i, 1);
                newValue = false;
            }
        }
        if(newValue){
            this.respuestas[index][this.respuestas[index].length] = answer;
        }
    }
  }

  setSimple(index, answer): void {
    this.respuestas[index] = answer;
  }

  setRango(index, answer): void {
    this.respuestas[index] = answer;
  }

  listCuestionariosRoute(): void {
      this.route.navigate(['/cuestionario']);
  }

  answerCuestionario(): void {
    console.log("responde", this.respuestas)
    let incomplete = null;
    for(let i = 0; i <  this.respuestas.length; i++){
        if(this.respuestas[i] == '' || this.respuestas[i] == ' ' || this.respuestas[i].length == 0){
            incomplete = i + 1;
        }
    }

    if(incomplete == null){
        console.log("se guarda")
        let respuestasFinales = this.generateFinalFormRespuestas();
        this.cuestionarioService.saveRespuestas(respuestasFinales).subscribe((res) => {
            console.log("res");
            alert("Se guardaron sus respuestas correctamente. su codigo de completacion es: " + res['data']['codigo']);
            this.route.navigate(['/cuestionario']);
        }), (error) => {
            alert("Hubo un problema. No se guardaron tus respuesta.");
          };
    }else{
        alert("No se guardaron sus respuestas. Falta responder la pregunta " + incomplete);
    }
  }

   generateFinalFormRespuestas(): any {
        const finalData = new FormData();
        let dataJson = []
        let i = 0;
        Object.keys(this.cuestionarioPreguntas).forEach(key => {
            let auxData = {
                'pregunta_id': this.cuestionarioPreguntas[key]['id'],
                'egresado_id': this.userId,
                'cuestionario_id': this.router.snapshot.params.id,
                'respuesta': this.respuestas[i]
            }
            dataJson[i] = auxData;
            i++;
        })
        return dataJson;
    }
}
