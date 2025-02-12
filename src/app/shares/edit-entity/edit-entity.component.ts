import { Component, ComponentRef, inject, Input, numberAttribute, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SERVICE_CRUD_TOKEN } from '../providers';
import { IServiceCRUD } from '../interfaces/service-crud';
import { Router } from '@angular/router';
import { extractErrors } from '../functions/extractErrors';
import { ShowErrorsComponent } from "../show-errors/show-errors.component";

@Component({
  selector: 'app-edit-entity',
  imports: [ShowErrorsComponent],
  templateUrl: './edit-entity.component.html',
  styleUrl: './edit-entity.component.css'
})
export class EditEntityComponent<TDTO, TCreationDTO> implements OnInit{

  ngOnInit(): void {
    this.serviceCRUD.getById(this.id).subscribe(entity => {
      this.uploadComponent(entity);
    })
  }

  uploadComponent(entity: any){
    this.componentRef = this.formContainer.createComponent(this.form);
    this.componentRef.instance.model = entity;
    this.componentRef.instance.postForm.subscribe((entity: any) => {
      this.save(entity);
    });
  }

  @Input({required: true})
  id!: number;

  @Input({required: true})
  title!: string;

  @Input({required: true})
  indexRoute!: string;

  @Input({required: true})
  form: any;

  errors: string[] = [];

  serviceCRUD = inject(SERVICE_CRUD_TOKEN) as IServiceCRUD<TDTO, TCreationDTO>;
  private route = inject(Router);

  @ViewChild('formContainer', {read: ViewContainerRef})
  formContainer!: ViewContainerRef;

  private componentRef!: ComponentRef<any>;

  save(entity: TCreationDTO){
    this.serviceCRUD.update(this.id, entity).subscribe({
      next: () => {
        this.route.navigate([this.indexRoute]);
      },
      error: err => {
        const errors = extractErrors(err);
        this.errors = errors;
      }
    });
  }
}