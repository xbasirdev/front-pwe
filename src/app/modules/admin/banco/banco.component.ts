import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BancoService  } from './banco.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    public bancosTableColumns: string[] = ['titulo', 'descripcion','lugar', 'opciones', 'acciones'];

    constructor(
        public bancoService: BancoService,
    ){
     
    }

    ngOnInit(): void {
        this.bancoService.getBanco().subscribe((res) => {
            console.log(res)
            this.bancos = res['data'];
            this.bancosCount = this.bancos.length
            console.log(this.bancos)
        })
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

    constructor(
        public bancoService: BancoService,
        private route: Router,
        private router: ActivatedRoute, 
    ){
     
    }

    ngOnInit(): void {
        console.log("pantalla correcta")
        if(this.router.snapshot.routeConfig.path !== 'banco/create'){

            if(this.router.snapshot.routeConfig.path === 'banco/edit/:id') {
              this.action = 'Edit';
            }
      
            if(this.router.snapshot.routeConfig.path === 'banco/detail/:id') {
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

    listBancoRoute(): void {
        console.log("entra")
        this.route.navigate(['/banco']);
    }  
}
