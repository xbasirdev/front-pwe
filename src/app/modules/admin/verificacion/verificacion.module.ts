import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { VerificacionAddComponent, VerificacionComponent } from 'app/modules/admin/verificacion/verificacion.component';
import { CuestionarioGraphComponent } from 'app/modules/admin/verificacion/verificacion.component';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';

const cuestionarioRoutes: Route[] = [
    {
        path     : '',
        component: VerificacionComponent
    },
    {
        path     : 'graph/:id',
        component: CuestionarioGraphComponent
    },
    {
        path     : 'create',
        component: VerificacionAddComponent
    },
    {
        path     : 'edit/:id',
        component: VerificacionAddComponent
    },
    {
        path     : 'detail/:id',
        component: VerificacionAddComponent
    }
];

@NgModule({
    declarations: [
        VerificacionComponent,
        CuestionarioGraphComponent,
        VerificacionAddComponent
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
        MatExpansionModule,
        NgApexchartsModule,
        MatRadioModule,
        RouterModule.forChild(cuestionarioRoutes)
    ]
})
export class VerificacionModule
{
}
