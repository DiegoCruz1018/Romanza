import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstLetterUpperCase, priceMustNotBeLessThanZero } from '../../shares/functions/validations';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { InputImgComponent } from "../../shares/input-img/input-img.component";
import { MultipleSelectorComponent } from "../../shares/multiple-selector/multiple-selector.component";

@Component({
  selector: 'app-form-products',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, RouterLink, MatButtonModule, InputImgComponent, MultipleSelectorComponent],
  templateUrl: './form-products.component.html',
  styleUrl: './form-products.component.css'
})
export class FormProductsComponent {

  private formBuilder = inject(FormBuilder);

  noSelectedIngredients = ['Pepperoni', 'Jamón', 'Queso', 'Chile'];

  selectedIngredients = [];

  form = this.formBuilder.group({
    Name: ['', {validators: [Validators.required, Validators.maxLength(50), firstLetterUpperCase()]}],
    Price: new FormControl<number | string | null>(null, {validators: [Validators.required, Validators.min(0), priceMustNotBeLessThanZero()]}),
    Image: new FormControl<File | string | null>(null),
    DateCreated: [new Date()]
  });

  getNameErrors(): string{
    let name = this.form.controls.Name;

    if(name.hasError('required')){
      return 'El nombre del producto es obligatorio';
    }

    if(name.hasError('maxLength')){
      return `El nombre no puede tener más de ${name.getError('maxLength').requiredLength} caracteres`;
    }

    if(name.hasError('firstLetterUpperCase')){
      return name.getError('firstLetterUpperCase').message;
    }

    return "";
  }

  getPriceErrors(): string{
    let price = this.form.controls.Price;

    if(price.hasError('required')){
      return 'El precio del producto es obligatorio';
    }

    if(price.hasError('min')){
      return 'El precio no puede ser menor que cero';
    }

    if(price.hasError('priceMustNotBeLessThanZero')){
      return price.getError('priceMustNotBeLessThanZero').message;
    }

    return "";
  }

  save(){
    
    if(!this.form.valid){
      return;
    }

  }
}
