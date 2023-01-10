import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BancoComponent } from 'app/modules/admin/banco/banco.component';
import { BancoAddComponent } from 'app/modules/admin/banco/banco.component';
import { BancoQuestionsComponent } from 'app/modules/admin/banco/banco.component';
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
import { MatExpansionModule } from '@angular/material/expansion';

const bancoRoutes: Route[] = [
    {
        path     : '',
        component: BancoComponent
    },
    {
        path     : 'create',
        component: BancoAddComponent
      },
      {
        path     : 'edit/:id',
        component: BancoAddComponent
      },
      {
        path     : 'detail/:id',
        component: BancoAddComponent
      },
      {
        path     : 'preguntas/:id',
        component: BancoQuestionsComponent
      }
];

@NgModule({
    declarations: [
        BancoComponent,
        BancoAddComponent,
        BancoQuestionsComponent,
    ],
    imports     : [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatExpansionModule,
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
        RouterModule.forChild(bancoRoutes)
    ]
})
export class BancoModule
{
}
