import { Component, inject } from '@angular/core';
import { FormIngredientsComponent } from "../form-ingredients/form-ingredients.component";
import { Router } from '@angular/router';
import { IngredientService } from '../ingredient.service';
import { CreationIngredientDTO } from '../ingredient';
import { extractErrors } from '../../shares/functions/extractErrors';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { CreateEntityComponent } from "../../shares/create-entity/create-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';

@Component({
  selector: 'app-create-ingredient',
  imports: [CreateEntityComponent],
  templateUrl: './create-ingredient.component.html',
  styleUrl: './create-ingredient.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: IngredientService}
  ]
})
export class CreateIngredientComponent {

  ingredientsForm = FormIngredientsComponent;

  // private router = inject(Router);
  // private ingredientService = inject(IngredientService);
  // errors: string[] = [];

  // save(ingredient: CreationIngredientDTO){

  //   this.ingredientService.create(ingredient).subscribe({
  //     next: () =>{
  //       this.router.navigate(['/ingredientes']);
  //     }, 
  //     error: err => {
  //       const errors = extractErrors(err);

  //       this.errors = errors;
  //     }
  //   })
  // }
}
