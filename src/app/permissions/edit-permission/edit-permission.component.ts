import { Component, Input, numberAttribute } from '@angular/core';
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { PermissionsService } from '../permissions-service.service';
import { FormPermissionComponent } from '../form-permission/form-permission.component';
import { EditEntityComponent } from "../../shares/edit-entity/edit-entity.component";

@Component({
  selector: 'app-edit-permission',
  imports: [EditEntityComponent],
  templateUrl: './edit-permission.component.html',
  styleUrl: './edit-permission.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: PermissionsService}
  ]
})
export class EditPermissionComponent {
  
  @Input({transform: numberAttribute})
  id!: number;

  formPermission = FormPermissionComponent;
}
