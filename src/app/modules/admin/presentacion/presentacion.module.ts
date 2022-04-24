import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PresentacionComponent } from 'app/modules/admin/presentacion/presentacion.component';
import { PresentacionAddComponent } from 'app/modules/admin/presentacion/presentacion.component';
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
import { FuseAlertModule } from '@fuse/components/alert';

const presentacionRoutes: Route[] = [
    {
        path     : '',
        component: PresentacionComponent
    },
    {
      path     : 'create',
      component: PresentacionAddComponent
    },
    {
      path     : 'edit/:id',
      component: PresentacionAddComponent
    },
    {
      path     : 'detail/:id',
      component: PresentacionAddComponent
    }
];

@NgModule({
    declarations: [
        PresentacionComponent,
        PresentacionAddComponent,
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
        FuseAlertModule,
        RouterModule.forChild(presentacionRoutes)
    ]
})
export class PresentacionModule
{
}
