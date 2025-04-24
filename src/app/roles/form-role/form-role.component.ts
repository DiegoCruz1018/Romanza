import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CreationRoleDTO, RoleDTO } from '../roles';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstLetterUpperCase } from '../../shares/functions/validations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';
import { MultipleSelectorComponent } from "../../shares/multiple-selector/multiple-selector.component";

@Component({
  selector: 'app-form-role',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, RouterLink, MultipleSelectorComponent],
  templateUrl: './form-role.component.html',
  styleUrl: './form-role.component.css'
})
export class FormRoleComponent implements OnInit{

  ngOnInit(): void {
    if(this.model != undefined){
      this.form.patchValue(this.model);
    }

    //console.log(this.model);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['model'] && this.model) {
  //     this.form.patchValue(this.model);
  //   }
  // }

  @Input()
  model?: RoleDTO | undefined;

  @Input({required: true})
  noSelectedPermissions!: MultipleSelectorDTO[];

  @Input({required: true})
  selectedPermissions!: MultipleSelectorDTO[];

  @Output()
  postForm = new EventEmitter<CreationRoleDTO>();

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', {validators: [Validators.required, Validators.maxLength(20), firstLetterUpperCase()]}]
  });

  getNameErrors(): string{
    let name = this.form.controls.name;

    if(name.hasError('required')){
      return 'El nombre del rol es obligatorio';
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

    const role = this.form.value as CreationRoleDTO;

    const permissionsId = this.selectedPermissions.map(val => val.key);
    role.permissionsIds = permissionsId;

    //console.log(role);

    this.postForm.emit(role);
  }
}
