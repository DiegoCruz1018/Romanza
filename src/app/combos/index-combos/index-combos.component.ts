import { Component, inject, OnInit } from '@angular/core';
import { IndexEntityComponent } from "../../shares/index-entity/index-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
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

@Component({
  selector: 'app-index-combos',
  imports: [ListGenericComponent, RouterLink, MatButtonModule, MatPaginatorModule, SweetAlert2Module, MatTableModule],
  templateUrl: './index-combos.component.html',
  styleUrl: './index-combos.component.css',
})
export class IndexCombosComponent implements OnInit{

  ngOnInit(): void {
    this.uploadRecords();
  }

  columnsToShow = ['id', 'image','name', 'price', 'acciones'];

  combos!: ComboDTO[];
  pagination: PaginationDTO = {page: 1, recordsPerPage: 5};
  quantityTotalRecords!: number;

  private combosService = inject(CombosService);
  private router = inject(Router);

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
    this.combosService.delete(id).subscribe(() => {
      this.pagination.page = 1;
      this.uploadRecords();
    })
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
