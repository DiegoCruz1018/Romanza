import { Component, inject, OnInit } from '@angular/core';
import { CombosService } from '../combos.service';
import { ListGenericComponent } from "../../shares/list-generic/list-generic.component";
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ComboDTO } from '../combos';
import { PaginationDTO } from '../../shares/models/PaginationDTO';
import { HttpResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AuthorizedComponent } from "../../security/authorized/authorized.component";
import Swal from 'sweetalert2';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-index-combos',
  imports: [ListGenericComponent, RouterLink, MatButtonModule, MatPaginatorModule, SweetAlert2Module, MatTableModule, MatIconModule, AuthorizedComponent],
  templateUrl: './index-combos.component.html',
  styleUrl: './index-combos.component.css',
})
export class IndexCombosComponent implements OnInit{

  ngOnInit(): void {
    this.uploadRecords();
    this.fillColumnsToShow();
  }

  combos!: ComboDTO[];
  pagination: PaginationDTO = {page: 1, recordsPerPage: 5};
  quantityTotalRecords!: number;
  
  columnsToShow: string[]= [];

  private combosService = inject(CombosService);
  private securityService = inject(SecurityService);

  hasPermission(permission: string): boolean{
    return this.securityService.hasPermission(permission);
  }

  fillColumnsToShow(){
    if(this.securityService.getFieldJWT('Administrador') || this.hasPermission('Editar Combo') || this.hasPermission('Eliminar Combo')){
      this.columnsToShow = ['id', 'image', 'name', 'price', 'acciones'];
    }else{
      this.columnsToShow = ['id', 'image', 'name', 'price'];
    }
  }

  uploadRecords(){
    this.combosService.get(this.pagination).subscribe((response: HttpResponse<ComboDTO[]>) => {
      this.combos = response.body as ComboDTO[];
      const headers = response.headers.get("quantity-total-records") as string;
      this.quantityTotalRecords = parseInt(headers, 10);
    })
  }

  updatePagination(data: PageEvent){
    this.pagination = {page: data.pageIndex, recordsPerPage: data.pageSize};
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
        this.combosService.delete(id).subscribe(() => {
          this.pagination.page = 1;
          this.uploadRecords();
        });
      }
    });
  }

  firstLetterUpperCase(value: string){

    if(!value) return;

    if(value === 'name'){
      value = 'nombre';
    }

    if(value == 'price'){
      value = "precio"
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
