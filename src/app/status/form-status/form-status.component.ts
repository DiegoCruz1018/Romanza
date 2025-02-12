import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CreationStatusDTO, StatusDTO } from '../status';
import { firstLetterUpperCase } from '../../shares/functions/validations';

@Component({
  selector: 'app-form-status',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './form-status.component.html',
  styleUrl: './form-status.component.css',
})
export class FormStatusComponent implements OnInit{

  ngOnInit(): void {
    if(this.model != undefined){
      this.form.patchValue(this.model);
    }
  }

  @Input()
  model: StatusDTO | undefined;

  @Output()
  postForm = new EventEmitter<CreationStatusDTO>();

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', {validators: [Validators.required, Validators.maxLength(20), firstLetterUpperCase()]}],
    dateCreated: [new Date()]
  });

  getNameErrors(): string{
    let name = this.form.controls.name;

    if(name.hasError('required')){
      return 'El nombre del status es obligatorio';
    }

    if(name.hasError('maxlength')){
      return `El nombre no puede tener más de ${name.getError('maxlength').requiredLength} caracteres`;
    }

    if(name.hasError('firstLetterUpperCase')){
      return name.getError('firstLetterUpperCase').message;
    }

    return '';
  }

  save(){
    if(!this.form.valid){
      return;
    }

    const status = this.form.value as CreationStatusDTO;

    this.postForm.emit(status);
  }
}
