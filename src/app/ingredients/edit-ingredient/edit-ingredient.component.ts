import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreationIngredientDTO, IngredientDTO } from '../ingredient';
import { IngredientService } from '../ingredient.service';
import { FormIngredientsComponent } from "../form-ingredients/form-ingredients.component";
import { Router } from '@angular/router';
import { extractErrors } from '../../shares/functions/extractErrors';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";

@Component({
  selector: 'app-edit-ingredient',
  imports: [FormIngredientsComponent, ShowErrorsComponent],
  templateUrl: './edit-ingredient.component.html',
  styleUrl: './edit-ingredient.component.css'
})
export class EditIngredientComponent implements OnInit{

  ngOnInit(): void {
    this.ingredientService.getForId(this.id).subscribe(ingredient => {
      this.ingredient = ingredient;
    })
  }
  
  @Input({transform: numberAttribute})
  id!: number;

  ingredient?: IngredientDTO;
  private ingredientService = inject(IngredientService);
  private router = inject(Router); 
  errors: string[] = [];

  save(ingredient: CreationIngredientDTO){
    //console.log('Editando el ingrediente: ', ingredient);

    this.ingredientService.update(this.id, ingredient).subscribe({
      next: () => {
        this.router.navigate(['ingredientes']);
      },
      error: err => {
        const errors = extractErrors(err)
        this.errors = errors;
      }
    });
  }
}
