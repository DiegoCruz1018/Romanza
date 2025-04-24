import { Component, inject, Inject } from '@angular/core';
import { IngredientDTO } from '../../ingredients/ingredient';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { HelpersService } from '../../shares/functions/helpers.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingredients-modal',
  imports: [MatIconModule, MatGridListModule, SweetAlert2Module],
  templateUrl: './ingredients-modal.component.html',
  styleUrl: './ingredients-modal.component.css'
})
export class IngredientsModalComponent {

  constructor(
    public dialogRef: MatDialogRef<IngredientsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {ingredients: IngredientDTO[], selectedIngredients: any}
  ){}

  private helpersService = inject(HelpersService);

  formatPrice(price: number){
    return this.helpersService.formatPrice(price);
  }

  selectedIngredients : {ingredient: IngredientDTO, quantity: number, unitPrice: number}[] = [];

  addIngredient(ingredient: IngredientDTO){

    this.selectedIngredients.push({ingredient, quantity: 1, unitPrice: Number(ingredient.price)});

    // Mostrar SweetAlert para confirmar que el ingrediente fue agregado
    Swal.fire({
      icon: 'success',
      title: 'Ingrediente agregado',
      text: `${ingredient.name} fue añadido correctamente.`,
      showConfirmButton: false,
      timer: 1500
    });
    //console.log(this.selectedIngredients);
  }

  // save(): void {
  //   //console.log('Ingredientes seleccionados antes de cerrar:', this.selectedIngredients); // Depuración
  //   this.dialogRef.close(this.selectedIngredients); // Enviar los ingredientes seleccionados al componente principal
  // }

  cancel(): void {
    this.dialogRef.close(this.selectedIngredients); // Enviar los ingredientes seleccionados al componente principal
  }
}
