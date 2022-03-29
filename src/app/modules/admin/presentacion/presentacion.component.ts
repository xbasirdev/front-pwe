import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PresentacionService  } from './presentacion.service';


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
