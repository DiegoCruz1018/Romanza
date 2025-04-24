import { Component } from '@angular/core';
import { IndexEntityComponent } from "../../shares/index-entity/index-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { PermissionsService } from '../permissions-service.service';

@Component({
  selector: 'app-index-permission',
  imports: [IndexEntityComponent],
  templateUrl: './index-permissions.component.html',
  styleUrl: './index-permissions.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: PermissionsService}
  ]
})
export class IndexPermissionComponent {

  columnsToShow = ['id', 'name', 'acciones'];
}