import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ComboDTO, CreationComboDTO } from '../combos';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstLetterUpperCase, priceMustNotBeLessThanZero } from '../../shares/functions/validations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MultipleSelectorComponent } from "../../shares/multiple-selector/multiple-selector.component";
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';
import { InputImgComponent } from "../../shares/input-img/input-img.component";

@Component({
  selector: 'app-from-combos',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink, MultipleSelectorComponent, InputImgComponent],
  templateUrl: './form-combos.component.html',
  styleUrl: './form-combos.component.css'
})
export class FormCombosComponent implements OnInit{

  ngOnInit(): void {
    if(this.model != undefined){
      this.form.patchValue(this.model);
    }
  }

  @Input()
  model: ComboDTO | undefined;

  @Input({required: true})
  noSelectedProducts!: MultipleSelectorDTO[];

  @Input({required: true})
  selectedProducts!: MultipleSelectorDTO[];

  @Output()
  postForm = new EventEmitter<CreationComboDTO>();

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', {validators: [Validators.required, Validators.maxLength(20), firstLetterUpperCase()]}],
    price: new FormControl<number | null | string>(null, {validators: [Validators.required, Validators.min(1), priceMustNotBeLessThanZero()]}),
    image: new FormControl<File | null | string>(null),
    dateCreated: [new Date()]
  });

  getNameErrors(): string{
    let name = this.form.controls.name;

    if(name.hasError('required')){
      return 'El nombre del combo es obligatorio';
    }

    if(name.hasError('maxlength')){
      return `El nombre no puede tener más de ${name.getError('maxlength').requiredLength} caracteres`;
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
      return `El precio no puede ser menor que ${price.getError('min').min - 1}`;
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

    const combo = this.form.value as CreationComboDTO;

    //Hacer un arreglo de enteros o números
    const productsIds = this.selectedProducts.map(val => val.key);
    combo.productsIds = productsIds;

    this.postForm.emit(combo);
  }
}
