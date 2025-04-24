import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { RolesService } from '../roles-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { FormRoleComponent } from "../form-role/form-role.component";
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';
import { CreationRoleDTO, RoleDTO } from '../roles';
import { extractErrorsIdentity } from '../../shares/functions/extractErrorsIdentity';

@Component({
  selector: 'app-edit-role',
  imports: [ShowErrorsComponent, FormRoleComponent],
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.css'
})
export class EditRoleComponent implements OnInit{

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;

    this.rolesService.updateGet(this.id).subscribe(model => {
      this.role = model.role;
      //console.log(this.role);

      this.noSelectedPermissions = model.noSelectedPermissions.map(permission => {
        return <MultipleSelectorDTO>{key: permission.id, value: permission.name};
      });

      this.selectedPermissions = model.selectedPermissions.map(permission => {
        return <MultipleSelectorDTO>{key: permission.id, value: permission.name};
      });

    });
  } 

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rolesService = inject(RolesService);

  id!: string;
  role!: RoleDTO;
  noSelectedPermissions!: MultipleSelectorDTO[];
  selectedPermissions!: MultipleSelectorDTO[];
  errors: string[] = [];

  save(role: CreationRoleDTO){

    this.rolesService.update(this.id, role).subscribe({
      next: () => {
        this.router.navigate(['/roles']);
      },
      error: err => {
        this.errors = extractErrorsIdentity(err);
      }
    });

  }
}
