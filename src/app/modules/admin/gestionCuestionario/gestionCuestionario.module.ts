import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { GestionCuestionarioAddComponent, GestionCuestionarioComponent } from 'app/modules/admin/gestionCuestionario/gestionCuestionario.component';
import { CuestionarioGraphComponent } from 'app/modules/admin/gestionCuestionario/gestionCuestionario.component';
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
import { NgApexchartsModule } from "ng-apexcharts";

const cuestionarioRoutes: Route[] = [
    {
        path     : '',
        component: GestionCuestionarioComponent
    },
    {
        path     : 'graph/:id',
        component: CuestionarioGraphComponent
    },
    {
        path     : 'create',
        component: GestionCuestionarioAddComponent
    },
    {
        path     : 'edit/:id',
        component: CuestionarioGraphComponent
    },
    {
        path     : 'detail/:id',
        component: CuestionarioGraphComponent
    }
];

@NgModule({
    declarations: [
        GestionCuestionarioComponent,
        CuestionarioGraphComponent,
        GestionCuestionarioAddComponent
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
        NgApexchartsModule,
        RouterModule.forChild(cuestionarioRoutes)
    ]
})
export class GestionCuestionarioModule
{
}
