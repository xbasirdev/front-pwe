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
    public cuestionariosCount;
    public cuestionariosTableColumns: string[] = ['titulo', 'descripcion', 'deporte', 'lugar', 'fecha', 'acciones'];

    constructor(
        public cuestionarioService: CuestionarioService,
        private route: Router,
        private router: ActivatedRoute, 
    ){
     
    }

    ngOnInit(): void {
        this.cuestionarioService.getCuestionarios().subscribe((res) => {
            console.log(res)
            this.cuestionarios = res['data'];
            this.cuestionariosCount = this.cuestionarios.length
            console.log(this.cuestionarios)
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
