import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredentialsUsersDTO, LoginDTO } from '../security';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-login',
  imports: [ReactiveFormsModule, MatInputModule, MatIconModule],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.css'
})
export class FormLoginComponent {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ['', {validators: [Validators.required, Validators.email]}],
    password: ['', {validators: [Validators.required]}]
  });

  @Output()
  postForm = new EventEmitter<LoginDTO>();

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

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  save(){

    if(!this.form.valid){
      return;
    }

    const credentials = this.form.value as LoginDTO;
    this.postForm.emit(credentials);
  }
}
