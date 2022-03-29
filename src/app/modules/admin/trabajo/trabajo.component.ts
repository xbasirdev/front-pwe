import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TrabajoService  } from './trabajo.service';


@Component({
    selector     : 'trabajo',
    templateUrl  : './trabajo.component.html',
    styleUrls    : ['./trabajo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TrabajoComponent implements OnInit
{
    public trabajos;
    public trabajosCount;
    public trabajosTableColumns: string[] = ['nombre', 'empresa', 'requisitos', 'carreras', 'opciones', 'acciones'];

    constructor(
        public trabajoService: TrabajoService,
    ){
     
    }

    ngOnInit(): void {
        this.trabajoService.getTrabajos().subscribe((res) => {
            this.trabajos = res['data'];
            this.trabajosCount = this.trabajos.length
            console.log(this.trabajos)
        })
    }
}
