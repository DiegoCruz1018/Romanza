import { Component, inject } from '@angular/core';
import { FormIngredientsComponent } from "../form-ingredients/form-ingredients.component";
import { Router } from '@angular/router';
import { IngredientService } from '../ingredient.service';
import { CreationIngredientDTO } from '../ingredient';
import { extractErrors } from '../../shares/functions/extractErrors';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";

@Component({
  selector: 'app-create-ingredient',
  imports: [FormIngredientsComponent, ShowErrorsComponent],
  templateUrl: './create-ingredient.component.html',
  styleUrl: './create-ingredient.component.css'
})
export class CreateIngredientComponent {

  private router = inject(Router);
  private ingredientService = inject(IngredientService);
  errors: string[] = [];

  save(ingredient: CreationIngredientDTO){

    this.ingredientService.create(ingredient).subscribe({
      next: () =>{
        this.router.navigate(['/ingredientes']);
      }, 
      error: err => {
        const errors = extractErrors(err);

        this.errors = errors;
      }
    })
  }
}
