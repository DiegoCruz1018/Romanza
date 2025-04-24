import { Component } from '@angular/core';
import { CreateEntityComponent } from "../../shares/create-entity/create-entity.component";
import { FormPermissionComponent } from '../form-permission/form-permission.component';
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { PermissionsService } from '../permissions-service.service';

@Component({
  selector: 'app-create-permission',
  imports: [CreateEntityComponent],
  templateUrl: './create-permission.component.html',
  styleUrl: './create-permission.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: PermissionsService}
  ]
})
export class CreatePermissionComponent {

  permissionForm = FormPermissionComponent;
}
