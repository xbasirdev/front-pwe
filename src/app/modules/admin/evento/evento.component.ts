import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EventoService  } from './evento.service';


@Component({
    selector     : 'evento',
    templateUrl  : './evento.component.html',
    styleUrls    : ['./evento.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EventoComponent implements OnInit
{
    public eventos;
    public eventosCount;
    public eventosTableColumns: string[] = ['titulo', 'descripcion', 'carreras', 'lugar', 'acciones'];

    constructor(
        public eventoService: EventoService,
    ){
     
    }

    ngOnInit(): void {
        this.eventoService.getEventos().subscribe((res) => {
            this.eventos = res['data'];
            this.eventosCount = this.eventos.length
            console.log(this.eventos)
        })
    }
}
