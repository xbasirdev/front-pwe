import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector     : 'perfil',
  templateUrl  : './perfil.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : FuseAnimations
})

export class PerfilComponent implements OnInit
{
  public cedula = '';
  
  constructor(
    
    private router: ActivatedRoute, 
      private _authService: AuthService, 
  ){
   
  }

  ngOnInit(): void {
    this.cedula = this._authService.accessUserID    
  }


}
