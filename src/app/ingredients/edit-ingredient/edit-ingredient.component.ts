import { Component, Input, numberAttribute } from '@angular/core';
import { IngredientService } from '../ingredient.service';
import { FormIngredientsComponent } from "../form-ingredients/form-ingredients.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { EditEntityComponent } from "../../shares/edit-entity/edit-entity.component";

@Component({
  selector: 'app-edit-ingredient',
  imports: [EditEntityComponent],
  templateUrl: './edit-ingredient.component.html',
  styleUrl: './edit-ingredient.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: IngredientService}
  ]
})
export class EditIngredientComponent{

  @Input({transform: numberAttribute})
  id!: number;

  ingredientForm = FormIngredientsComponent;

  /*
  ngOnInit(): void {
    this.ingredientService.getById(this.id).subscribe(ingredient => {
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
    */
}
