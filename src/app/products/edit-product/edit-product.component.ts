import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreationProductDTO, ProductDTO } from '../products';
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';
import { ProductService } from '../products.service';
import { Router } from '@angular/router';
import { FormProductsComponent } from "../form-products/form-products.component";
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { extractErrors } from '../../shares/functions/extractErrors';

@Component({
  selector: 'app-edit-product',
  imports: [FormProductsComponent, ShowErrorsComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit{

  ngOnInit(): void {
    this.productService.updateGet(this.id).subscribe(model => {
      this.product = model.product

      this.noSelectedIngredients = model.noSelectedIngredients.map(ingredient => {
        return <MultipleSelectorDTO>{key: ingredient.id, value: ingredient.name};
      });

      //console.log(model.selectedIngredients);

      this.selectedIngredients = model.selectedIngredients.map(ingredients => {
        return <MultipleSelectorDTO>{key: ingredients.id, value: ingredients.name};
      })
      
      //console.log(model.product)
      //console.log(this.selectedIngredients);
    });
  }

  @Input({transform: numberAttribute})
  id!: number;

  product!: ProductDTO;
  selectedIngredients!: MultipleSelectorDTO[];
  noSelectedIngredients!: MultipleSelectorDTO[];

  private productService = inject(ProductService);
  private router = inject(Router);

  errors: string[] = [];

  save(product: CreationProductDTO){
    this.productService.update(this.id, product).subscribe({
      next: () => {
        this.router.navigate(['/productos']);
      },
      error: err => {
        const errors = extractErrors(err);
        this.errors = errors;
      }
    });
  }
}
