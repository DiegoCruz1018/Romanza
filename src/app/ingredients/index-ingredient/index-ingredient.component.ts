import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CreationIngredientDTO, IngredientDTO } from '../ingredient';
import { ListGenericComponent } from "../../shares/list-generic/list-generic.component";
import { IngredientService } from '../ingredient.service';
import { PaginationDTO } from '../../shares/models/PaginationDTO';
import { HttpResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { IndexEntityComponent } from "../../shares/index-entity/index-entity.component";

@Component({
  selector: 'app-index-ingredient',
  imports: [MatButtonModule, MatTableModule, MatButtonModule, MatPaginatorModule, SweetAlert2Module, IndexEntityComponent],
  templateUrl: './index-ingredient.component.html',
  styleUrl: './index-ingredient.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: IngredientService}
  ]
})
export class IndexIngredientComponent{

  columnsToShow = ['id', 'name', 'price', 'acciones'];

  /*
  ngOnInit(): void {
    this.uploadRecords();
  }

  ingredients!: IngredientDTO[];
  ingredientService = inject(IngredientService);

  columnsToShow = ['id', 'name', 'price', 'acciones'];

  pagination: PaginationDTO = {page: 1, recordsPerPage: 5};
  quantityTotalRecords!: number;

  uploadRecords(){
    this.ingredientService.get(this.pagination).subscribe((response: HttpResponse<IngredientDTO[]>) => {
      this.ingredients = response.body as IngredientDTO[];
      const header = response.headers.get("quantity-total-records") as string;
      //console.log(header);
      this.quantityTotalRecords = parseInt(header, 10);
      //console.log(this.ingredients);
      //console.log(this.quantityTotalRecords);
    });
  }  

  updatePagination(data: PageEvent){
    // console.log(data);
    // console.log(data.pageIndex + 1);
    // console.log(data.pageSize);
    this.pagination = {page: data.pageIndex + 1, recordsPerPage: data.pageSize};
    this.uploadRecords();
  }

  delete(id: number){
    this.ingredientService.delete(id).subscribe(() => {
      this.pagination = {page: 1, recordsPerPage: 5};
      this.uploadRecords();
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
  */
}
