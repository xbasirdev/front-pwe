import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UsuarioService  } from './usuario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector     : 'usuario',
    templateUrl  : './usuario.component.html',
    styleUrls    : ['./usuario.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsuarioComponent implements OnInit
{
    public usuarios;
    public usuariosCount;
    public usuariosTableColumns: string[] = ['nombres', 'correo', 'acciones'];

    constructor(
        public usuarioService: UsuarioService,
    ){
     
    }

    ngOnInit(): void {
        this.usuarioService.getUsuarios().subscribe((res) => {
            console.log(res)
            this.usuarios = res['data'];
            this.usuariosCount = this.usuarios.length
            console.log(this.usuarios)
        })
    }
}


@Component({
    selector     : 'usuario-add',
    templateUrl  : './usuario.add.component.html',
    styleUrls    : ['./usuario.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsuarioAddComponent implements OnInit
{

    public action = ''; 
    public srcResult = ''; 
    formFieldHelpers: string[] = [''];

    constructor(
        public usuarioService: UsuarioService,
        private route: Router,
        private router: ActivatedRoute, 
    ){
     
    }

    ngOnInit(): void {
        console.log("pantalla correcta")
        if(this.router.snapshot.routeConfig.path !== 'usuario/create'){

            if(this.router.snapshot.routeConfig.path === 'usuario/edit/:id') {
              this.action = 'Edit';
            }
      
            if(this.router.snapshot.routeConfig.path === 'usuario/detail/:id') {
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

    listUsuariosRoute(): void {
        console.log("entra")
        this.route.navigate(['/usuario']);
    }  
}
