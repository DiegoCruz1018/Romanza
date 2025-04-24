import { Component, inject, Input } from '@angular/core';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-authorized',
  imports: [],
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css'
})
export class AuthorizedComponent {
  
  securityService = inject(SecurityService);

  // @Input()
  // rol?: string;

  @Input()
  role!: string[];

  isAuthorized(): boolean{
    
    // if(this.rol){
    //   return this.securityService.getRol() == this.rol;
    // }else{
    //   return this.securityService.isLogged();
    // }

    if(this.role && this.role.length > 0){
      return this.securityService.getRol().some(r => this.role.includes(r));
    }else{
      return this.securityService.isLogged();
    }
  }
}
