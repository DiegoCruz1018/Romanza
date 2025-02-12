import { AfterViewInit, Component, ComponentRef, inject, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ShowErrorsComponent } from "../show-errors/show-errors.component";
import { SERVICE_CRUD_TOKEN } from '../providers';
import { IServiceCRUD } from '../interfaces/service-crud';
import { Router } from '@angular/router';
import { extractErrors } from '../functions/extractErrors';

@Component({
  selector: 'app-create-entity',
  imports: [ShowErrorsComponent],
  templateUrl: './create-entity.component.html',
  styleUrl: './create-entity.component.css'
})                                               //AfterViewInit para despues de que se inicialice la vista
export class CreateEntityComponent<TDTO, TCreationDTO> implements AfterViewInit{

  ngAfterViewInit(): void {
    //Pasamos el formulario como parametro y nos devolverá un componente el cual guardaremos en una variable
    this.componentRef = this.formContainer.createComponent(this.form);
    this.componentRef.instance.postForm.subscribe((entity: any) => {
      this.save(entity);
    });
  }

  @Input({required: true})
  title!: string;

  errors: string[] = [];

  @Input({required: true})
  indexRoute!: string;

  @Input({required: true})
  form: any;

  serviceCRUD = inject(SERVICE_CRUD_TOKEN) as IServiceCRUD<TDTO, TCreationDTO>;
  private router = inject(Router);

  //Nos permite tomar las referencias del ng-template
  @ViewChild('formContainer', { read: ViewContainerRef})
  formContainer!: ViewContainerRef;

  private componentRef!: ComponentRef<any>;
  
  save(entity: TCreationDTO){
    this.serviceCRUD.create(entity).subscribe({
      next: () => {
        this.router.navigate([this.indexRoute]);
      },
      error: err => {
        const errors = extractErrors(err);
        this.errors = errors;
        //console.log(this.errors);
      }
    });
  }
}
