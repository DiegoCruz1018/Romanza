import { Component } from '@angular/core';
import { IndexEntityComponent } from "../../shares/index-entity/index-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { CombosService } from '../combos.service';

@Component({
  selector: 'app-index-combos',
  imports: [IndexEntityComponent],
  templateUrl: './index-combos.component.html',
  styleUrl: './index-combos.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: CombosService}
  ]
})
export class IndexCombosComponent {
  columnsToShow = ['id', 'name', 'price', 'acciones'];
}
