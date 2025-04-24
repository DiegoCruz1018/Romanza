import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ListGenericComponent } from "../../shares/list-generic/list-generic.component";
import { SecurityService } from '../../security/security.service';
import { UserDTO } from '../../security/security';
import { PaginationDTO } from '../../shares/models/PaginationDTO';
import { HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AuthorizedComponent } from "../../security/authorized/authorized.component";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-users',
  imports: [RouterLink, MatIconModule, ListGenericComponent, MatTableModule, AuthorizedComponent, SweetAlert2Module, MatPaginatorModule],
  templateUrl: './index-users.component.html',
  styleUrl: './index-users.component.css'
})
export class IndexUsersComponent implements OnInit{

  ngOnInit(): void {
    this.uploadRecords();
    this.fillColumnsToShow();
  }

  private securityService = inject(SecurityService);
  
  columnsToShow: string[] = [];

  users!: UserDTO[];
  pagination: PaginationDTO = {page: 1, recordsPerPage: 5};
  quantityTotalRecords!: number;

  hasPermission(permission: string): boolean{
    return this.securityService.hasPermission(permission);
  }

  fillColumnsToShow(){
    if(this.securityService.getFieldJWT('Administrador') || this.hasPermission('Editar Usuario') || this.hasPermission('Eliminar Usuario')){
      this.columnsToShow = ['name', 'email', 'phonenumber', 'acciones'];
    }else{
      this.columnsToShow = ['name', 'email', 'phonenumber'];
    }
  }

  uploadRecords(){
    this.securityService.get(this.pagination).subscribe((response: HttpResponse<UserDTO[]>) => {
      this.users = response.body as UserDTO[];
      const headers = response.headers.get("quantity-total-records") as string;
      this.quantityTotalRecords = parseInt(headers, 10);

      //console.log(this.users);
    });
  }

  updatePagination(data: PageEvent){
    this.pagination = {page: data.pageIndex + 1, recordsPerPage: data.pageSize};
    this.uploadRecords();
  }

  delete(id: string){

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#027702',
      cancelButtonColor: '#D70505',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.securityService.delete(id).subscribe(() => {
          this.pagination.page = 1;
          this.uploadRecords();
        });
      }
    });
  }

  firstLetterUpperCase(value: string){

    if(!value) value;

    if(value === 'name'){
      value = 'nombre';
    }

    if(value === 'lastname'){
      value = 'apellido';
    }

    if(value === 'phonenumber'){
      value = 'teléfono';
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
