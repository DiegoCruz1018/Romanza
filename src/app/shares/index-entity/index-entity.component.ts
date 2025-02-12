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

@Component({
  selector: 'app-index-entity',
  standalone: true,
  imports: [ListGenericComponent, RouterLink, MatButtonModule, MatTableModule, MatPaginatorModule, SweetAlert2Module],
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

  serviceCRUD = inject(SERVICE_CRUD_TOKEN) as IServiceCRUD<TDTO, TCreationTDTO>;

  entities!: TDTO[];
  pagination: PaginationDTO = {page: 1, recordsPerPage: 5};
  quantityTotalRecords!: number;

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
    this.serviceCRUD.delete(id).subscribe(() => {
      this.pagination.page = 1;
      this.uploadRecords();
    })
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
