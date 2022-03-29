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
    public products;
    public productsCount;
    public productsTableColumns: string[] = ['id', 'titulo'];

    constructor(
        public presentacionService: PresentacionService,
    ){
     
    }

    ngOnInit(): void {
        this.presentacionService.getPresentaciones().subscribe((res) => {
            console.log(res)
            this.products = res['data'];
            this.productsCount = this.products.length
            console.log(this.products)
        })
    }
}
