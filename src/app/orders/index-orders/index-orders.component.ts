import { Component, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../orders.service';
import { HttpResponse } from '@angular/common/http';
import { OrderDTO } from '../Orders';
import { ProductDTO } from '../../products/products';
import { IngredientDTO } from '../../ingredients/ingredient';
import { ProductService } from '../../products/products.service';
import { IngredientService } from '../../ingredients/ingredient.service';
import { ComboDTO } from '../../combos/combos';
import { CombosService } from '../../combos/combos.service';
import { StatusDTO } from '../../status/status';
import { StatusService } from '../../status/status.service';
import { HelpersService } from '../../shares/functions/helpers.service';
import { extractErrors } from '../../shares/functions/extractErrors';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-index-orders',
  imports: [RouterLink, MatIconModule, MatDividerModule, SweetAlert2Module, MatFormFieldModule, MatSelectModule],
  templateUrl: './index-orders.component.html',
  styleUrl: './index-orders.component.css'
})
export class IndexOrdersComponent implements OnInit{
  
  ngOnInit(): void {
    this.getOrders();
    this.getProducts();
    this.getCombos();
    this.getIngredients();
    this.getStatus();
  }

  private ordersService = inject(OrdersService);
  private productService = inject(ProductService);
  private combosService = inject(CombosService);
  private ingredientsService = inject(IngredientService);
  private statusService = inject(StatusService);
  private helpersService = inject(HelpersService);
  private securityService = inject(SecurityService);

  orders: OrderDTO[] = [];
  products: ProductDTO[] = [];
  combos: ComboDTO[] = [];
  ingredients?: IngredientDTO[] = [];
  status: StatusDTO[] = [];
  errors: string[] = [];

  filter: string = 'hoy';

  hasPermission(permission: string): boolean{
    return this.securityService.hasPermission(permission);
  }
  
  getOrders(){
    this.ordersService.get(this.filter, null).subscribe((response: HttpResponse<OrderDTO[]>) => {
      this.orders = response.body as OrderDTO[];
      //console.log(this.orders);
    })
  }

  getProducts(){
    this.productService.getAll().subscribe((response: HttpResponse<ProductDTO[]>) => {
      this.products = response.body as ProductDTO[];
      //console.log(this.products);
    })
  }

  getCombos(){
    this.combosService.getAll().subscribe((response: HttpResponse<ComboDTO[]>) => {
      this.combos = response.body as ComboDTO[];
      //console.log(this.combos);
    })
  }

  getIngredients(){
    this.ingredientsService.getAll().subscribe((response: HttpResponse<IngredientDTO[]>) => {
      this.ingredients = response.body as IngredientDTO[];
      //console.log(this.ingredients);
    })
  }

  getStatus(){
    this.statusService.getAll().subscribe((response: HttpResponse<StatusDTO[]>) => {
      this.status = response.body as StatusDTO[];
      //console.log(this.status);
    })
  }

  //Métodos auxiliares
  getProductValue(productId: number, value: keyof ProductDTO): string | number | Date{
    //const product = this.products.find(product => product.id === productId)?.name;

    // const product = this.products.find(product => product.id === productId);

    // if(product && product[value] != undefined){
    //   return product[value];
    // }

    // return 'Producto no encontrado';

    return this.helpersService.getItemValue(this.products, productId, value);
  }

  getComboValue(comboId: number, value: keyof ComboDTO): string | number | Date{
    // const combo = this.combos.find(combo => combo.id === comboId);

    // if(combo && combo[value] != undefined){
    //   return combo[value];
    // }

    // return 'Combo no encontrado';

    return this.helpersService.getItemValue(this.combos, comboId, value);
  }

  getIngredientValue(ingredientId: number, value: keyof IngredientDTO): string | number | Date{
    // const ingredient = this.ingredients?.find(ingredient => ingredient.id === ingredientId);

    // if(ingredient && ingredient[value] != undefined){
    //   return ingredient[value];
    // }

    // return 'Ingrediente no encontrado';

    return this.helpersService.getItemValue(this.ingredients, ingredientId, value);
  }

  getStatusValue(statusId: number, value: keyof StatusDTO): string | number | Date{
    // const status = this.status.find(status => status.id === statusId);

    // if(status && status[value] != undefined){
    //   return status[value];
    // }

    // return 'Estatus no encontrado'
    
    return this.helpersService.getItemValue(this.status, statusId, value);
  }

  formatPrice(price: number): string {
    return this.helpersService.formatPrice(price);
  }  

  orderDelivered(orderId: number){
    const newStatusId = 1;

    //console.log(orderId);

    this.ordersService.deliverOrder(orderId).subscribe({
      next: () => {

        const order = this.orders.find(o => o.id === orderId);

        if(order){
          order.statusId = 1;
        }

        Swal.fire({
          icon: 'success',
          title: 'Orden entregada',
          showConfirmButton: false,
          timer: 1000
        });
      },
      error: err => {
        const errors = extractErrors(err);
        this.errors = errors;
      }
    });
  }

  deleteOrder(orderId: number){
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
        this.ordersService.delete(orderId).subscribe(() => {
          this.getOrders();
          Swal.fire(
            'Eliminado!',
            'La orden ha sido eliminada.',
            'success'
          )
        })
      }
    })
  }
}