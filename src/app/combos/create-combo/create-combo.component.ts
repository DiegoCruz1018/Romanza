import { Component, Input, numberAttribute } from '@angular/core';
import { CreateEntityComponent } from "../../shares/create-entity/create-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { CombosService } from '../combos.service';
import { FormCombosComponent } from '../form-combos/form-combos.component';

@Component({
  selector: 'app-create-combo',
  imports: [CreateEntityComponent],
  templateUrl: './create-combo.component.html',
  styleUrl: './create-combo.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: CombosService}
  ]
})
export class CreateComboComponent {

  @Input({transform: numberAttribute})
  id!: number;

  comboForm = FormCombosComponent;
}
