import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { UsuarioComponent } from 'app/modules/admin/usuario/usuario.component';
import { UsuarioAddComponent } from 'app/modules/admin/usuario/usuario.component';
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

const usuarioRoutes: Route[] = [
    {
        path     : '',
        component: UsuarioComponent
    },
    {
        path     : 'create',
        component: UsuarioAddComponent
      },
      {
        path     : 'edit/:id',
        component: UsuarioAddComponent
      },
      {
        path     : 'detail/:id',
        component: UsuarioAddComponent
      },
      {
        path     : 'perfil/:id',
        component: UsuarioAddComponent
      }
];

@NgModule({
    declarations: [
        UsuarioComponent,
        UsuarioAddComponent,
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
        RouterModule.forChild(usuarioRoutes)
    ]
})
export class UsuarioModule
{
}
