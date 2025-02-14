import { Component, inject, Input, numberAttribute } from '@angular/core';
import { CreateEntityComponent } from "../../shares/create-entity/create-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { CombosService } from '../combos.service';
import { FormCombosComponent } from '../form-combos/form-combos.component';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';
import { Router } from '@angular/router';
import { CreationProductDTO } from '../../products/products';
import { CreationComboDTO } from '../combos';
import { extractErrors } from '../../shares/functions/extractErrors';

@Component({
  selector: 'app-create-combo',
  imports: [ShowErrorsComponent, FormCombosComponent],
  templateUrl: './create-combo.component.html',
  styleUrl: './create-combo.component.css',
})
export class CreateComboComponent {

  noSelectedProducts: MultipleSelectorDTO[] = [];
  selectedProducts: MultipleSelectorDTO[] = [];

  private combosService = inject(CombosService);
  private router = inject(Router);

  errors: string[] = [];  

  constructor(){
    this.combosService.createGet().subscribe(model => {
      this.noSelectedProducts = model.products.map(product => {
        return <MultipleSelectorDTO>{key: product.id, value: product.name};
      })
    });
  }

  save(combo: CreationComboDTO){

    this.combosService.create(combo).subscribe({
      next: () => {
        this.router.navigate(['/combos']);
      },
      error: err => {
        const errors = extractErrors(err);
        this.errors = errors;
      }
    });
  }
}
