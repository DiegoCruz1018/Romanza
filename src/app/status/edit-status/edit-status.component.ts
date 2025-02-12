import { Component, Input, numberAttribute } from '@angular/core';
import { EditEntityComponent } from "../../shares/edit-entity/edit-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { StatusService } from '../status.service';
import { FormStatusComponent } from '../form-status/form-status.component';

@Component({
  selector: 'app-edit-status',
  imports: [EditEntityComponent],
  templateUrl: './edit-status.component.html',
  styleUrl: './edit-status.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: StatusService}
  ]
})
export class EditStatusComponent {

  @Input({transform: numberAttribute})
  id!: number;

  statusForm = FormStatusComponent;
}
