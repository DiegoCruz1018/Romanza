import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { CombosService } from '../combos.service';
import { FormCombosComponent } from '../form-combos/form-combos.component';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { Router } from '@angular/router';
import { ComboDTO, CreationComboDTO } from '../combos';
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';
import { extractErrors } from '../../shares/functions/extractErrors';

@Component({
  selector: 'app-edit-combo',
  imports: [ShowErrorsComponent, FormCombosComponent],
  templateUrl: './edit-combo.component.html',
  styleUrl: './edit-combo.component.css',
})
export class EditComboComponent implements OnInit{

  ngOnInit(): void {
    this.combosService.updateGet(this.id).subscribe(model => {
      this.combo = model.combo;

      this.noSelectedProducts = model.noSelectedProducts.map(product => {
        return <MultipleSelectorDTO>{key: product.id, value: product.name};
      })      

      this.selectedProducts = model.selectedProducts.map(product => {
        return <MultipleSelectorDTO>{key: product.id, value: product.name};
      });
    });
  }

  @Input({transform: numberAttribute})
  id!: number;

  combo!: ComboDTO;
  noSelectedProducts!: MultipleSelectorDTO[];
  selectedProducts!: MultipleSelectorDTO[];

  private combosService = inject(CombosService);
  private router = inject(Router);

  errors: string[] = [];

  save(combo: CreationComboDTO){
    this.combosService.update(this.id, combo).subscribe({
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
