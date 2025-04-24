import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CredentialsUsersDTO, LoginDTO } from '../security';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { extractErrorsIdentity } from '../../shares/functions/extractErrorsIdentity';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { FormLoginComponent } from "../form-login/form-login.component";

@Component({
  selector: 'app-login',
  imports: [ShowErrorsComponent, FormLoginComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  private securityService = inject(SecurityService);
  private router = inject(Router);
  permissions: string[] = [];
  errors: string[] = [];

  login(credentials: LoginDTO){
    this.securityService.login(credentials).subscribe({
      next: () => {

        this.securityService.loadPermissions().subscribe(perms => {
          this.permissions = perms;
          //console.log(this.permissions);
          this.router.navigate(['/ordenes']);
        });
      },
      error: err => {
        const errors = extractErrorsIdentity(err);
        this.errors = errors;
      }
    });
  }
}
