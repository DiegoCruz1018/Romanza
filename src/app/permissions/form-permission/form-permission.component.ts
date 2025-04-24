import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CreationPermissionDTO, PermissionDTO } from '../permissions';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstLetterUpperCase } from '../../shares/functions/validations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-permission',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './form-permission.component.html',
  styleUrl: './form-permission.component.css'
})
export class FormPermissionComponent implements OnInit{

  ngOnInit(): void {
    if(this.model != undefined){
      this.form.patchValue(this.model);
    }
  }

  @Input()
  model: PermissionDTO | undefined;

  @Output()
  postForm = new EventEmitter<CreationPermissionDTO>();

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', {validators: [Validators.required, Validators.maxLength(20), firstLetterUpperCase]}]
  });

  getNameErrors(): string{
    const name = this.form.controls.name;

    if(name.hasError('required')){
      return 'El nombre del permiso es obligatorio';
    }

    if(name.hasError('maxlength')){
      return `El nombre no debe de tener mas de ${name.getError('maxlength').requiredLength} caracteres`;
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

    const permission = this.form.value as CreationPermissionDTO;

    this.postForm.emit(permission);
  }
}
