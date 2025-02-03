import { Component } from '@angular/core';
import { FormProductsComponent } from "../form-products/form-products.component";

@Component({
  selector: 'app-create-product',
  imports: [FormProductsComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {

}
