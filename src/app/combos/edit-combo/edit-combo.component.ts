import { Component, Input, numberAttribute } from '@angular/core';
import { EditEntityComponent } from "../../shares/edit-entity/edit-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { CombosService } from '../combos.service';
import { FormCombosComponent } from '../form-combos/form-combos.component';

@Component({
  selector: 'app-edit-combo',
  imports: [EditEntityComponent],
  templateUrl: './edit-combo.component.html',
  styleUrl: './edit-combo.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: CombosService}
  ]
})
export class EditComboComponent {

  @Input({transform: numberAttribute})
  id!: number;

  comboForm = FormCombosComponent;
}
