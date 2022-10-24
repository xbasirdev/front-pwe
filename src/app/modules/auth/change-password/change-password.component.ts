import { Component, OnInit, ViewChild, ViewEncapsulation,  Inject, Input  } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { FuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router, ParamMap  } from '@angular/router';




/**
 * @title Dialog with header, scrollable content and actions
 */
 @Component({
    selector: 'app-changepasswordialog',
    templateUrl: './change-password-dialog.component.html',
    animations   : FuseAnimations
    
  })
  
  export class ChangePasswordDialogComponent {

    @ViewChild('changePasswordNgForm') changePasswordNgForm: NgForm;
    changePasswordForm: FormGroup;
    formFieldHelpers = "";
    showAlert: boolean = false;    
      password: string;
      passwordConfirm: string;
      alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
      };
     
    
    
    constructor(  
        private _authService: AuthService, 
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) private data: DialogData) {
          
      }  
  
    ngOnInit(): void
    {
        // Create the form
        this.changePasswordForm = this._formBuilder.group({
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            }, {
              validators: FuseValidators.mustMatch('password', 'passwordConfirm')
          }
        );
        
    }

    savePassword(): void
    {
      
       // Return if the form is invalid
       if ( this.changePasswordForm.invalid )
       {
           return;
       }

       let id = this.data ?? this._authService.accessEmail;

       // Disable the form
       this.changePasswordForm.disable();

       // Hide the alert
       this.showAlert = false;
       //let id = this.route.snapshot.params.id ?? this._authService.accessEmail;
       

      let data = {
        'password' : this.changePasswordForm.get('password').value,
        'password_confirmation' : this.changePasswordForm.get('passwordConfirm').value,
        "id": id
      };

      this._authService.changePassword(data).subscribe((res) => {
        this.alert = {
          type   : 'success',
          message: 'Contraseña cambiada con exito'
        };
        this.showAlert = true;
        
      }), (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: error.error
        };
        this.showAlert = true;
      };
      // Re-enable the form
      this.changePasswordForm.enable();

      // Reset the form
      this.changePasswordNgForm.resetForm();
    }

    
  }

  /**
 * @title Dialog with header, 
 */
 @Component({
  selector: 'app-changepassword',
  templateUrl: './change-password.component.html',
  animations   : FuseAnimations
})


export class ChangePasswordComponent {

  @Input() id: string;
  
  constructor(  
      private _authService: AuthService, 
      private _formBuilder: FormBuilder,
      public dialog: MatDialog,
      private route: ActivatedRoute,
      private router: Router,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        
    }  

  ngOnInit(): void
  {
     
  }
  
  openChangePasswordDialog():void {
    const importDialog = this.dialog.open(ChangePasswordDialogComponent, { data :this.id});  
    importDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

  export interface DialogData {}