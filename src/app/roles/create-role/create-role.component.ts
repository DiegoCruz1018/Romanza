import { Component, inject, OnInit } from '@angular/core';
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { RolesService } from '../roles-service.service';
import { FormRoleComponent } from '../form-role/form-role.component';
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';
import { Router } from '@angular/router';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { CreationRoleDTO } from '../roles';
import { extractErrors } from '../../shares/functions/extractErrors';
import { extractErrorsIdentity } from '../../shares/functions/extractErrorsIdentity';

@Component({
  selector: 'app-create-role',
  imports: [FormRoleComponent, ShowErrorsComponent],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: RolesService}
  ]
})
export class CreateRoleComponent implements OnInit{

  ngOnInit(): void {
    this.rolesService.createGet().subscribe(model => {
      this.noSelectedPermissions = model.permissions.map(permissions => {
        return <MultipleSelectorDTO>{key: permissions.id, value: permissions.name};
      });
    });
  }

  private rolesService = inject(RolesService);
  private router = inject(Router);
  
  noSelectedPermissions: MultipleSelectorDTO[] = [];
  selectedPermissions: MultipleSelectorDTO[] = [];
  errors: string[] = [];

  save(role: CreationRoleDTO){

    this.rolesService.create(role).subscribe({
      next: () => {
        this.router.navigate(['/roles']);
      },
      error: err => {
        this.errors = extractErrorsIdentity(err);
      }
    });
  }
}
