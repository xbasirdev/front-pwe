import { ChangeDetectionStrategy, ChangeDetectorRef , Component, Input, OnChanges, EventEmitter, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { UserService } from './user.service';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseValidators } from '@fuse/validators';
import { User } from '../user/user.model';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { CarreraService } from '../carrera/carrera.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD/MM/YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD/MM/YYYY',
  },
};


@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user',
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
  
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})

export class UserComponent implements OnInit
{
    @Input() userData: string;
    @Input() type: string;
    @Input() returnSuccess: string;
    @Input() form: string;
    public date = new FormControl(moment());
    public isOpen = false;
    public registerUserForm: FormGroup;
    public action = ''; 
    public role = ''; 
    public profile:boolean = false; 
    public showNotification = true;
    public formFieldHelpers: string = "";
    public showAlert: boolean = false;
    public formBuilderGroup;
    public carreras: [];

    public alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };

    
    public user: User = {
      nombres: '',
      apellidos: "",
      cedula: '',
      correo: '',
      telefono: '',
      role:"",
      egresado:{
        fecha_egreso: '',
        modo_registro: '',
        notificacion: false,
        periodo_egreso: '',
        correo: '',
        carrera_id:''
      }
    };
      
    constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      public userService: UserService,
      public dialog: MatDialog,
      private route: Router,
      private router: ActivatedRoute, 
      private _formBuilder: FormBuilder,
      public carreraService: CarreraService,
      ){
        this.registerUserForm = this._formBuilder.group(
          {
            nombres:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            apellidos:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            cedula:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            correo:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            password:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            password_confirm:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            telefono:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            periodo_egreso:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            correo_personal:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            fecha_egreso:[ new FormControl({value: '', disabled: false}, Validators.nullValidator)],
            carrera:[ new FormControl({value: '', disabled: false, onlySelf: true}, Validators.nullValidator)],
          }
        );
    }

    ngOnInit(): void {
      if(this.form != "administrator"){
        this.registerUserForm.controls['carrera'].setValue("-", {onlySelf: true});
        this.carreraService.getCarreras().subscribe((res) => {
          this.carreras = res['data'];
        });
        
      }

      let disabled = false;
      let validatorMust = {};

      if(this.form=="administrator"){
        this.user.role = 'administrator';
      }
     
      if(this.router.snapshot.routeConfig.path === 'create'){
        this.action = 'Add';
        validatorMust = {
          validators: FuseValidators.mustMatch('password', 'password_confirm')
        };
        
       

      }else{
        if(this.router.snapshot.routeConfig.path === 'edit/:id') {
          this.action = 'Edit';
        }
        
        if(this.router.snapshot.routeConfig.path === 'view-perfil'){
          this.action = 'Profile';
          this.profile = true;
          disabled = true;
        }
  
        if(this.router.snapshot.routeConfig.path === 'detail/:id') {
          this.action = 'Detail'; 
        }
        this.getUser();  
      }   
 
      
      this.formBuilderGroup = {
        nombres:[{value: this.user.nombres, disabled: disabled}, Validators.required],
        apellidos:[{value: this.user.apellidos, disabled: disabled}, Validators.required],
        cedula:[{value: this.user.cedula, disabled: disabled}, [Validators.required, Validators.pattern("[VvEe]-[0-9]{6,}$")]],
        correo:[{value: this.user.correo, disabled: disabled}, [Validators.required,Validators.email]],
        telefono:[{value: this.user.telefono, disabled: false }, [Validators.nullValidator, Validators.pattern("0(2(12|3[4589]|4[0-9]|[5-8][1-9]|9[1-5])|(4(12|14|16|24|26)))-?[0-9]{7}")]],
      }

      if(this.action == "Edit" || this.profile){
        this.formBuilderGroup.password= [{value: "", disabled: false }, [Validators.nullValidator]];
        this.formBuilderGroup.password_confirm= [{value: "", disabled: false }, [Validators.nullValidator]];
      } 
      
      if(this.action == "Add" || !this.profile){
        this.formBuilderGroup.password=[{value: "", disabled: false }, Validators.required];
        this.formBuilderGroup.password_confirm=[{value: "", disabled: false }, Validators.required];
      }

      if(this.form != "administrator" || !this.profile){
        this.formBuilderGroup.carrera=[{value: this.user.egresado.carrera_id, disabled: disabled }, [Validators.required]];
        this.formBuilderGroup.periodo_egreso=[{value: this.user.egresado.periodo_egreso, disabled: disabled}, [Validators.required, Validators.pattern("^[12][0-9]{3}[-][1-9]{1}$")]];
        this.formBuilderGroup.correo_personal=[{value: this.user.egresado.correo, disabled: false },[Validators.email]];
        this.formBuilderGroup.fecha_egreso=[{value: moment(this.user.egresado.fecha_egreso).format("YYYY-MM-DDTHH:mm"), disabled: disabled} ];
      }

      this.registerUserForm = this._formBuilder.group(this.formBuilderGroup, validatorMust);
  }

  getUser(): void {
    let cedula:string = this.userData;
    this.userService.getUser(cedula).subscribe((res) => {
      this.user = res['data'];
      this.role = res["data"]["role"];
      if(res["data"]["egresado"] == null){
        this.user.egresado ={
          fecha_egreso: '',
          modo_registro: '',
          notificacion: true,
          periodo_egreso: '',
          correo: '',
          carrera_id:''
        }
      }
      
      if(this.action == 'Detail'){
        this.registerUserForm.disable();
      }

      this._changeDetectorRef.markForCheck();
    }), (error) => {
      this.alert = {
        type   : 'error',
        message: 'No se encontro el user'
      };
      this.showAlert = true;
    };
  }

  saveUser(): void {
    if ( this.registerUserForm.invalid ){
        this.registerUserForm.markAllAsTouched();
        return;
    }
    this.showAlert = false;
    this.registerUserForm.addControl('form_type', new FormControl({value: this.form, disabled: false}, Validators.nullValidator));
    let data = this.registerUserForm.value;
    this.userService.saveUser(data).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se creo un nuevo registro'
      };
      this.showAlert = true;
      if(this.returnSuccess!=="" ){
        this.route.navigate([this.returnSuccess]);
      }    
    }, (error) => {
      console.log(error);
      this.alert = {
        type   : 'error',
        message: 'No se pudo crear el registro'
      };
      this.showAlert = true;
    });
  }

  updateUser(): void {
    if ( this.registerUserForm.invalid ){
      this.registerUserForm.markAllAsTouched();
      return;
    }

    let cedula:string = this.userData;
    this.showAlert = false;
    this.registerUserForm.addControl('form_type', new FormControl({value: this.form, disabled: false}, Validators.nullValidator));
    let data = this.registerUserForm.value;
    data.form_type = this.form;
    
    this.userService.updateUser(cedula, data).subscribe((res) => {
      this.alert = {
        type   : 'success',
        message: 'Se actualizaron los cambios correctamente'
      };
      this.showAlert = true;
      if(this.returnSuccess!=="" ){
        this.route.navigate([this.returnSuccess]);
      }      
    }, (error) => {
      this.alert = {
        type   : 'error',
        message: 'No se pudo actualizar los cambios'
      };
      this.showAlert = true;
    });
  }

  changeNotificationStatus( status: boolean): void{
      let id:string = this.userData;
      this.userService.updateNotificationStatus({"status": status, "id":id}).subscribe((res) => {
        status = !status;
        this.showNotification = res["data"]["notificacion"];    
        this.alert = {
          type   : 'success',
          message: 'Estado de notificaciones actualizadas'
        };
        this.showAlert = true;    
      }), (error) => {
        console.log(error);
        this.alert = {
          type   : 'error',
          message: 'Error al actualizar estado de notificaciones'
        };
        this.showAlert = true;
      };
  }

  changeRole( status: boolean, rol:string): void{
    let id:string = this.userData;
    this.userService.updateRole(id).subscribe((res) => {
      if(this.returnSuccess!=="" ){
        this.route.navigate([this.returnSuccess]);
      }     
    }), (error) => {
      this.alert = {
        type   : 'error',
        message: 'Error al actualizar rol'
      };
      this.showAlert = true;
    };
}

  
      

}
