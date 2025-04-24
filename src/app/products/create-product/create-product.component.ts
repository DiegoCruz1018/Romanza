import { Component, inject } from '@angular/core';
import { FormProductsComponent } from "../form-products/form-products.component";
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';
import { ProductService } from '../products.service';
import { Router } from '@angular/router';
import { CreationProductDTO } from '../products';
import { extractErrors } from '../../shares/functions/extractErrors';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";

@Component({
  selector: 'app-create-product',
  imports: [FormProductsComponent, ShowErrorsComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {

  selectedIngredients: MultipleSelectorDTO[] = [];
  noSelectedIngredients: MultipleSelectorDTO[] = [];

  private productService = inject(ProductService);

  private router = inject(Router);

  errors: string[] = [];

  constructor(){
    this.productService.createGet().subscribe(model => {
      this.noSelectedIngredients = model.ingredients.map(ingredient => {
        //console.log(<MultipleSelectorDTO>{ key: ingredient.id, value: ingredient.name });
        return <MultipleSelectorDTO>{ key: ingredient.id, value: ingredient.name };
      });
    });
  }

  save(product: CreationProductDTO){

    //console.log(product);
    
    this.productService.create(product).subscribe({
      next: () => {
        this.router.navigate(['/productos']);
      },
      error: err => {
        const errors = extractErrors(err);
        this.errors = errors;
      }
    })
  }
}
