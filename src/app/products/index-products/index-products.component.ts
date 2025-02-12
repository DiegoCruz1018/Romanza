import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../products.service';
import { ProductDTO } from '../products';
import { PaginationDTO } from '../../shares/models/PaginationDTO';
import { HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { ListGenericComponent } from "../../shares/list-generic/list-generic.component";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-index-products',
  imports: [RouterLink, ListGenericComponent, MatButtonModule, MatInputModule, SweetAlert2Module, MatPaginatorModule, MatTableModule],
  templateUrl: './index-products.component.html',
  styleUrl: './index-products.component.css'
})
export class IndexProductsComponent implements OnInit{

  ngOnInit(): void {
    this.uploadRecords();
  }

  private productService = inject(ProductService);

  columnsToShow = ['id', 'image', 'name', 'price', 'acciones'];

  products!: ProductDTO[];
  pagination: PaginationDTO = {page: 1, recordsPerPage: 5};
  quantityTotalRecords!: number;

  uploadRecords(){
    this.productService.get(this.pagination).subscribe((response: HttpResponse<ProductDTO[]>) => {
      this.products = response.body as ProductDTO[];
      const headers = response.headers.get("quantity-total-records") as string;
      this.quantityTotalRecords = parseInt(headers, 10);

      //console.log(this.products);
    });
  }

  updatePagination(data: PageEvent){
    this.pagination = {page: data.pageIndex + 1, recordsPerPage: data.pageSize};
    this.uploadRecords();
  }

  delete(id: number){
    
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
