import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GradoService  } from './grado.service';


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

    constructor(
        public gradoService: GradoService,
    ){
     
    }

    ngOnInit(): void {
        this.gradoService.getGrados().subscribe((res) => {
            this.grados = res['data'];
            this.gradosCount = this.grados.length
            console.log(this.grados)
        })
    }
}
