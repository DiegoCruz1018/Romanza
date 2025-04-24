import { Component, inject, model } from '@angular/core';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { CredentialsUsersDTO } from '../security';
import { extractErrorsIdentity } from '../../shares/functions/extractErrorsIdentity';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { FormAuthenticationComponent } from "../form-authentication/form-authentication.component";
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';

@Component({
  selector: 'app-register',
  imports: [ShowErrorsComponent, FormAuthenticationComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(){
    this.securityService.createGet().subscribe(model => {
      this.noSelectedRoles = model.roles.map(role => {
        return <MultipleSelectorDTO>{ key: role.id, value: role.name };
      });
    });
  }

  private securityService = inject(SecurityService);
  private router = inject(Router);

  noSelectedRoles: MultipleSelectorDTO[] = [];
  selectedRoles: MultipleSelectorDTO[] = [];
  errors: string[] = [];

  register(credentials: CredentialsUsersDTO){
    // console.log("register() method called with credentials: ", credentials);
    this.securityService.register(credentials).subscribe({
      next: () => {
        this.router.navigate(['/usuarios']);
        // console.log("next:", credentials);
      },
      error: err => {
        const errors = extractErrorsIdentity(err);
        this.errors = errors;
        // console.log("errors:", credentials)
      }
    });
  }
}
