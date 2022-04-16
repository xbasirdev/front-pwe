import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ExtensionService  } from './extension.service';


@Component({
    selector     : 'extension',
    templateUrl  : './extension.component.html',
    styleUrls    : ['./extension.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExtensionComponent implements OnInit
{
    public extensiones;
    public extensionesCount;
    public extensionesTableColumns: string[] = ['titulo', 'tipo', 'descripcion', 'carrera', 'opciones', 'acciones'];

    constructor(
        public extensionService: ExtensionService,
    ){
     
    }

    ngOnInit(): void {
        this.extensionService.getExtensiones().subscribe((res) => {
            this.extensiones = res['data'];
            this.extensionesCount = this.extensiones.length
            console.log(this.extensiones)
        })
    }
}
