import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PresentacionService  } from './presentacion.service';
import { ActivatedRoute, Router } from '@angular/router';

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

    constructor(
        public presentacionService: PresentacionService,
    ){
     
    }

    ngOnInit(): void {
        this.presentacionService.getPresentaciones().subscribe((res) => {
            console.log(res)
            this.presentaciones = res['data'];
            this.presentacionesCount = this.presentaciones.length
            console.log(this.presentaciones)
        })
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

    public action = ''; 
    public srcResult = ''; 
    formFieldHelpers: string[] = [''];

    constructor(
        public presentacionService: PresentacionService,
        private route: Router,
        private router: ActivatedRoute, 
    ){
     
    }

    ngOnInit(): void {
        console.log("pantalla correcta")
        if(this.router.snapshot.routeConfig.path !== 'presentacion/create'){

            if(this.router.snapshot.routeConfig.path === 'presentacion/edit/:id') {
              this.action = 'Edit';
            }
      
            if(this.router.snapshot.routeConfig.path === 'presentacion/detail/:id') {
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

    listPresentacionesRoute(): void {
        console.log("entra")
        this.route.navigate(['/presentacion']);
    }  
}
