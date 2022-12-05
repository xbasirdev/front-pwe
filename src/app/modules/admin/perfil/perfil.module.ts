import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PerfilComponent } from 'app/modules/admin/perfil/perfil.component';
import { MatIconModule } from '@angular/material/icon';
import { UserModule } from '../user/user.module';


const perfilRoutes: Route[] = [
    {
        path     : 'view-perfil',
        component: PerfilComponent
    },    
];

@NgModule({
    declarations: [
        PerfilComponent,
    ],
    imports     : [
        MatIconModule,
        UserModule,
        RouterModule.forChild(perfilRoutes)
    ],
    
})

export class PerfilModule
{
}
