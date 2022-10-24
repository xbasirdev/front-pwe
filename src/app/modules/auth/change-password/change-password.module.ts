import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { CommonModule } from '@angular/common'
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { ChangePasswordComponent } from 'app/modules/auth/change-password/change-password.component';
import { ChangePasswordDialogComponent } from 'app/modules/auth/change-password/change-password.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@NgModule({
    declarations: [
        ChangePasswordComponent,
        ChangePasswordDialogComponent
    ],
    imports     : [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule
    ],
    entryComponents: [
        MatDialogModule,
        //ChangePasswordComponent,
          
    ],
    providers: [
            { provide: MAT_DIALOG_DATA, useValue: {} },
            { provide: MatDialogRef, useValue: {} }
    ],
    exports: [
       ChangePasswordComponent,
    ]
})
export class ChangePasswordModule
{
}


