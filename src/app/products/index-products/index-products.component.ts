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
import { AuthorizedComponent } from "../../security/authorized/authorized.component";
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-index-products',
  imports: [RouterLink, ListGenericComponent, MatButtonModule, MatInputModule, SweetAlert2Module, MatPaginatorModule, MatTableModule, MatIconModule, AuthorizedComponent],
  templateUrl: './index-products.component.html',
  styleUrl: './index-products.component.css'
})
export class IndexProductsComponent implements OnInit{

  ngOnInit(): void {
    this.uploadRecords();
    this.fillColumnsToShow();
  }

  private productService = inject(ProductService);
  private securityService = inject(SecurityService);

  columnsToShow: string[] = [];

  products!: ProductDTO[];
  pagination: PaginationDTO = {page: 1, recordsPerPage: 5};
  quantityTotalRecords!: number;

  hasPermission(permission: string): boolean{
    return this.securityService.hasPermission(permission);
  }

  fillColumnsToShow(){
    if(this.securityService.getFieldJWT('Administrador') || this.hasPermission('Editar Producto') || this.hasPermission('Eliminar Producto')){
      this.columnsToShow = ['id', 'image', 'name', 'price', 'acciones'];
    }else{
      this.columnsToShow = ['id', 'image', 'name', 'price'];
    }
  }

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
        
        this.productService.delete(id).subscribe(() => {
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
