import { Component, inject, Input, OnInit } from '@angular/core';
import { ListGenericComponent } from "../list-generic/list-generic.component";
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SERVICE_CRUD_TOKEN } from '../providers';
import { PaginationDTO } from '../models/PaginationDTO';
import { HttpResponse } from '@angular/common/http';
import { IServiceCRUD } from '../interfaces/service-crud';
import { MatIconModule } from '@angular/material/icon';
import { AuthorizedComponent } from "../../security/authorized/authorized.component";
import Swal from 'sweetalert2';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-index-entity',
  standalone: true,
  imports: [ListGenericComponent, RouterLink, MatButtonModule, MatTableModule, MatPaginatorModule, SweetAlert2Module, MatIconModule, AuthorizedComponent],
  templateUrl: './index-entity.component.html',
  styleUrl: './index-entity.component.css'
})
export class IndexEntityComponent<TDTO, TCreationTDTO> implements OnInit{

  ngOnInit(): void {
      this.uploadRecords();
  }

  @Input({required: true})
  title!: string;

  @Input({required: true})
  routeCreate!: string;

  @Input({required: true})
  routeEdit!: string;

  @Input({required: true})
  columnsToShow = ['id', 'name', 'actions'];

  private serviceCRUD = inject(SERVICE_CRUD_TOKEN) as IServiceCRUD<TDTO, TCreationTDTO>;
  private securityService = inject(SecurityService);

  entities!: TDTO[];
  pagination: PaginationDTO = {page: 1, recordsPerPage: 5};
  quantityTotalRecords!: number;

  hasPermission(permission: string): boolean{
    return this.securityService.hasPermission(permission);
  }

  titleModified(): string {

    // Si el título no es "Status", modifica el título eliminando la última 's'
    if (this.title !== 'Status') {

      if(this.title as string === 'Roles'){
        return this.title.slice(0, -2);
      }

      return this.title.slice(0, -1); // Elimina la última letra 's'
    }
  
    // Si el título es "Status", devuelve el título sin modificaciones
    return this.title;
  }

  getCreatePermission(): string {
    // Usa el título modificado para construir el permiso
    const modifiedTitle = this.titleModified();
    // console.log(modifiedTitle);
    return `Crear ${modifiedTitle}`;
  }

  getEditPermission(): string {

    const modifiedTitle = this.titleModified();
    // console.log(modifiedTitle);
    return `Editar ${modifiedTitle}`;
  }

  getDeletePermission(): string {

    const modifiedTitle = this.titleModified();
    // console.log(modifiedTitle);
    return `Eliminar ${modifiedTitle}`;
  }

  uploadRecords(){
    this.serviceCRUD.get(this.pagination).subscribe((response: HttpResponse<TDTO[]>) => {
      this.entities = response.body as TDTO[];
      const header = response.headers.get("quantity-total-records") as string;
      this.quantityTotalRecords = parseInt(header, 10);
    });
  }

  updatePagination(data: PageEvent){
    this.pagination = {page: data.pageIndex + 1, recordsPerPage: data.pageSize};
    this.uploadRecords();
  }

  delete(id: number){

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#027702',
      cancelButtonColor: '#D70505',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if(result.isConfirmed){

        this.serviceCRUD.delete(id).subscribe(() => {
          this.pagination.page = 1;
          this.uploadRecords();
        });

      }
    });

  }

  firstLetterUpperCase(value: string){
    
    if(!value) return value;

    if(value === 'name'){
      value = 'nombre';
    }

    if(value === 'price'){
      value = 'precio'
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
