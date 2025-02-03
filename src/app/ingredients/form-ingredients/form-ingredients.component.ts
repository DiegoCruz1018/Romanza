import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstLetterUpperCase, priceMustNotBeLessThanZero } from '../../shares/functions/validations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { extractErrors } from '../../shares/functions/extractErrors';
import { CreationIngredientDTO, IngredientDTO } from '../ingredient';

@Component({
  selector: 'app-form-ingredients',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './form-ingredients.component.html',
  styleUrl: './form-ingredients.component.css'
})
export class FormIngredientsComponent implements OnInit{
  
  ngOnInit(): void {

    if(this.model !== undefined){

      //patchValue es para pasarle valores a un formulario
      this.form.patchValue(this.model);
      //console.log(this.model);
    }
  }

  @Input()
  model: IngredientDTO | undefined;

  @Output()
  postForm = new EventEmitter<CreationIngredientDTO>();

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', {validators: [Validators.required, Validators.maxLength(20), firstLetterUpperCase()]}],
    price: new FormControl<number | null | string>(null, {validators: [Validators.required, Validators.min(0), priceMustNotBeLessThanZero()]}),
    dateCreated: [new Date()]
  });

  getNameErrors(): string{
    let name = this.form.controls.name;

    if(name.hasError('required')){
      return 'El nombre del ingrediente es obligatorio';
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
      return 'El precio del ingrediente es obligatorio';
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

    const ingredient = this.form.value as CreationIngredientDTO;

    this.postForm.emit(ingredient);
  }
}
