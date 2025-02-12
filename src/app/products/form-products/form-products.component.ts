import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstLetterUpperCase, priceMustNotBeLessThanZero } from '../../shares/functions/validations';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { InputImgComponent } from "../../shares/input-img/input-img.component";
import { MultipleSelectorComponent } from "../../shares/multiple-selector/multiple-selector.component";
import { CreationProductDTO, ProductDTO } from '../products';
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';

@Component({
  selector: 'app-form-products',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, RouterLink, MatButtonModule, InputImgComponent, MultipleSelectorComponent],
  templateUrl: './form-products.component.html',
  styleUrl: './form-products.component.css'
})
export class FormProductsComponent implements OnInit{

  ngOnInit(): void {
    if(this.model !== undefined){
      this.form.patchValue(this.model);
    }
  }

  private formBuilder = inject(FormBuilder);
  
  @Input()
  model?: ProductDTO | undefined;

  @Input({required: true})
  noSelectedIngredients!: MultipleSelectorDTO[];

  @Input({required: true})
  selectedIngredients!: MultipleSelectorDTO[];

  @Output()
  postForm = new EventEmitter<CreationProductDTO>();

  form = this.formBuilder.group({
    name: ['', {validators: [Validators.required, Validators.maxLength(50), firstLetterUpperCase()]}],
    price: new FormControl<number | null | string>(null, {validators: [Validators.required, Validators.min(0), priceMustNotBeLessThanZero()]}),
    image: new FormControl<File | null | string>(null),
    dateCreated: [new Date()]
  });

  getNameErrors(): string{
    let name = this.form.controls.name;

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
    let price = this.form.controls.price;

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

  fileSelected(file: File){
    this.form.controls.image.setValue(file);
  }

  save(){
    
    if(!this.form.valid){
      return;
    }

    const product = this.form.value as CreationProductDTO;

    //Hacer un arreglo de enteros o números
    const ingredientsIds = this.selectedIngredients.map(val => val.key);
    product.ingredientsIds = ingredientsIds;

    this.postForm.emit(product);
  }
}