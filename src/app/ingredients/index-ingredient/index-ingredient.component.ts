import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IngredientService } from '../ingredient.service';
import { PaginationDTO } from '../../shares/models/PaginationDTO';
import { HttpResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { IndexEntityComponent } from "../../shares/index-entity/index-entity.component";
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-index-ingredient',
  imports: [MatButtonModule, MatTableModule, MatButtonModule, MatPaginatorModule, SweetAlert2Module, IndexEntityComponent],
  templateUrl: './index-ingredient.component.html',
  styleUrl: './index-ingredient.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: IngredientService}
  ]
})
export class IndexIngredientComponent implements OnInit{

  ngOnInit(): void {
    this.fillColumnToSHow();
  }

  private securityService = inject(SecurityService);

  columnsToShow: string[] = [];

  hasPermission(permission: string){
    return this.securityService.hasPermission(permission);
  }

  fillColumnToSHow(){
    if(this.securityService.getFieldJWT('Administrador') || this.hasPermission('Editar Ingrediente') || this.hasPermission('Eliminar Ingrediente')){
      this.columnsToShow = ['id', 'name', 'price', 'acciones'];
    }else{
      this.columnsToShow = ['id', 'name', 'price'];
    }
  }

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
