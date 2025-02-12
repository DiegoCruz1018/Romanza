import { Component } from '@angular/core';
import { CreateEntityComponent } from "../../shares/create-entity/create-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { StatusService } from '../status.service';
import { FormStatusComponent } from '../form-status/form-status.component';

@Component({
  selector: 'app-create-status',
  imports: [CreateEntityComponent],
  templateUrl: './create-status.component.html',
  styleUrl: './create-status.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: StatusService}
  ]
})
export class CreateStatusComponent {
  
  statusForm = FormStatusComponent;
}
