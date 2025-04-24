import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredentialsUsersDTO, UserDTO } from '../security';
import { firstLetterUpperCase } from '../../shares/functions/validations';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MultipleSelectorComponent } from "../../shares/multiple-selector/multiple-selector.component";
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-authentication',
  imports: [ReactiveFormsModule, MatInputModule, RouterLink, MultipleSelectorComponent, SweetAlert2Module],
  templateUrl: './form-authentication.component.html',
  styleUrl: './form-authentication.component.css'
})
export class FormAuthenticationComponent implements OnInit{

  ngOnInit(): void {
    if(this.model){
      this.form.patchValue(this.model);
      this.form.controls.password.setValidators([]);
    }else{
      this.form.controls.password.setValidators([Validators.required]);
    }

    // Actualizamos el estado de validación después de cambiar los validadores
    this.form.controls.password.updateValueAndValidity();
  }

  @Input()
  model?: UserDTO | undefined;

  @Input({required: true})
  noSelectedRoles!: MultipleSelectorDTO[];

  @Input({required: true})
  selectedRoles!: MultipleSelectorDTO[];
  
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', {validators: [Validators.required, firstLetterUpperCase()]}],
    lastname: ['', {validators: [Validators.required, firstLetterUpperCase()]}],
    phonenumber: ['', {validators: [Validators.required]}],
    email: ['', {validators: [Validators.required, Validators.email]}],
    password: ['', {validators: []}],
    dateCreated: [new Date()]
  });

  @Output()
  postForm = new EventEmitter<CredentialsUsersDTO>();

  getNameErrors(): string{
    let name = this.form.controls.name;

    if(name.hasError('required')){
      return "El nombre es obligatorio";
    }

    if(name.hasError('firstLetterUpperCase')){
      return name.getError('firstLetterUpperCase').message;
    }

    return "";
  }

  getLastnameErrors(): string{
    let lastname = this.form.controls.lastname;

    if(lastname.hasError('required')){
      return "El apellido es obligatorio";
    }

    if(lastname.hasError('firstLetterUpperCase')){
      return lastname.getError('firstLetterUpperCase').message;
    }

    return "";
  }

  getPhoneNumberErrors(): string{
    let phonenumber = this.form.controls.phonenumber;

    if(phonenumber.hasError('required')){
      return "El teléfono es obligatorio";
    }

    return "";
  }

  getEmailErrors(): string{
    let email = this.form.controls.email;

    if(email.hasError('required')){
      return "El email es obligatorio";
    }

    if(email.hasError('email')){
      return "El email no es válido";
    }

    return "";
  }

  getPasswordErrors(): string{
    let password = this.form.controls.password;

    if(password.hasError('required')){
      return "El password es obligatorio";
    }

    return "";
  }

  save(){
  
    if(!this.form.valid){
      return;
    }

    if(this.selectedRoles.length === 0){
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar al menos un rol',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }

    //console.log('Enviando cuenta...');
  
    //Copiamos los valores del formulario
    const credentials = {...this.form.value} as CredentialsUsersDTO;

    if(!credentials.password){
      delete credentials.password;
    }

    //Hacer un arreglo de enteros o números
    const rolesIds = this.selectedRoles.map(role => role.key.toString());
    credentials.rolesIds = rolesIds;

    //console.log(credentials);

    this.postForm.emit(credentials);
  }
}
