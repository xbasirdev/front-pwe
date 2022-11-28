import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TrabajoComponent, TrabajoAddComponent, TrabajoAplicacionComponent } from 'app/modules/admin/trabajo/trabajo.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';

const trabajoRoutes: Route[] = [
    {
        path     : '',
        component: TrabajoComponent
    },
    {
        path     : 'create',
        component: TrabajoAddComponent
    },
    {
        path     : 'aplicacion',
        component: TrabajoAplicacionComponent
    },
    {
        path     : 'edit/:id',
        component: TrabajoAddComponent
    },
    {
        path     : 'detail/:id',
        component: TrabajoAddComponent
    }
];

@NgModule({
    declarations: [
        TrabajoComponent, TrabajoAddComponent, TrabajoAplicacionComponent
    ],
    imports     : [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTooltipModule,
        SharedModule,
        RouterModule.forChild(trabajoRoutes)
    ]
})
export class TrabajoModule
{
}
