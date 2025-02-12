import { Component } from '@angular/core';
import { IndexEntityComponent } from "../../shares/index-entity/index-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { StatusService } from '../status.service';

@Component({
  selector: 'app-index-status',
  imports: [IndexEntityComponent],
  templateUrl: './index-status.component.html',
  styleUrl: './index-status.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: StatusService}
  ]
})
export class IndexStatusComponent {

  columnsToShow = ['id', 'name', 'acciones'];
}
