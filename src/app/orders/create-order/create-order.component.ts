import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { ProductService } from '../../products/products.service';
import { ProductDTO } from '../../products/products';
import { HttpResponse } from '@angular/common/http';
import { ComboDTO } from '../../combos/combos';
import { CombosService } from '../../combos/combos.service';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CreationOrderDTO, OrderDetailsDTO, OrderDTO } from '../Orders';
import { CreateOrderModalComponent } from '../create-order-modal/create-order-modal.component';
import { OrdersService } from '../orders.service';
import { HelpersService } from '../../shares/functions/helpers.service';
import { SecurityService } from '../../security/security.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { extractErrors } from '../../shares/functions/extractErrors';
import { IngredientDTO } from '../../ingredients/ingredient';

@Component({
  selector: 'app-create-order',
  imports: [MatGridListModule, MatDialogModule, SweetAlert2Module],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit{

  ngOnInit(): void {
    this.getProducts();
    this.getCombos();
    //console.log(this.id);
    this.userId = this.securityService.getFieldJWT('id');

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      //console.log(id);

      if (id) {
        this.orderId = Number(id);
        //console.log(this.orderId);
        this.loadOrder(this.orderId);
      }

    });
  }

  private productService = inject(ProductService);
  private combosService = inject(CombosService);
  private orderService = inject(OrdersService);
  private helpersService = inject(HelpersService);
  private securityService = inject(SecurityService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  //Id de la orden que se va a editar
  // @Input({transform: numberAttribute})
  // id?: number;

  products: ProductDTO[] = [];
  combos: ComboDTO[] = [];
  userId: string = '';
  errors: string[] = [];
  orderId?: number;

  order: OrderDTO = {
    id: 0,
    clientName: '',
    clientPhoneNumber: '',
    total: 0,
    userId: this.userId,
    statusId: 2,
    orderDetails: [],
    dateCreated: new Date()
  }

  private dialog = inject(MatDialog);

  // Agregar una propiedad para almacenar la referencia del diálogo
  activeDialog?: MatDialogRef<CreateOrderModalComponent>;

  //Abrir Modal de la orden:
  openOrderModal(): void {

    // Si ya hay un modal abierto, cerrarlo
    if (this.activeDialog) {
      this.activeDialog.close();
    }

    // Verificar si hay orderId
    if (this.orderId) {
      // Usar la orden existente si ya fue cargada
      if (this.order.id === this.orderId) {
        this.openOrderModalWithData();
      } else {
        // Cargar la orden si aún no está cargada
        this.loadOrder(this.orderId);
      }
    } else {
      // Abrir modal para nueva orden
      this.openOrderModalWithData();
    }

    //Verificar si hay un ID en los queryparams
    // this.route.paramMap.subscribe(params => {
    //   const id = params.get('id');
    //   //console.log(id);
    //   this.orderId = Number(id);

    //   if(this.orderId){
    //     //Cargar los datos de la orden para edición
    //     this.loadOrder(this.orderId);
    //   }else{
    //     //Si no hay ID abrir el modal con la orden vacía para crearla
    //     const dialogRef = this.dialog.open(CreateOrderModalComponent, {
    //       width: '600px',
    //       data: { order: this.order }
    //     });

    //     dialogRef.componentInstance.products = this.products;
    //     dialogRef.componentInstance.combos = this.combos;

    //     dialogRef.afterClosed().subscribe(result => {
    //       if(result){
    //         this.save(result);
    //       }
    //     });
    //   }
    //});

    // const dialogRef = this.dialog.open(CreateOrderModalComponent, {
    //   width: '600px',
    //   data: { order: this.order }
    // });

    //Pasamos los datos de products y combos
    // dialogRef.componentInstance.products = this.products;
    // dialogRef.componentInstance.combos = this.combos;

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     //console.log('Orden guardada:', result);
    //     //this.order = result
    //     //console.log(this.order);
    //     this.save(result);
    //   }
    // });
  }

  // Método para abrir el modal con los datos actuales
  openOrderModalWithData(): void {
    this.activeDialog = this.dialog.open(CreateOrderModalComponent, {
      width: '600px',
      data: { order: this.order }
    });

    this.activeDialog.componentInstance.products = this.products;
    this.activeDialog.componentInstance.combos = this.combos;
    this.activeDialog.componentInstance.errors = this.errors;

    this.activeDialog.afterClosed().subscribe(result => {
      if (result) {
        this.save(result);
      }
      this.activeDialog = undefined; // Limpiar la referencia cuando se cierra
    });
  }

  //Cargar orden que se va a editar
  loadOrder(id: number) {
    this.orderService.getOrderById(id).subscribe(order => {

      // Asegurarse de que cada detalle tenga los campos necesarios
      order.orderDetails.forEach(detail => {

        //console.log(detail.quantity);
        //console.log(detail.unitPrice);

        //Siempre recalcula el precio de los ingredientes y agrégalo al unitPrice del detalle
        if(detail.orderDetailsIngredients && detail.orderDetailsIngredients.length > 0){

          const ingredientsPrice = detail.orderDetailsIngredients.reduce((sum, ingredient) => {
            //console.log(ingredient.unitPrice);
            return sum +  (Number(ingredient.unitPrice || 0) * Number(ingredient.quantity) || 1);
          }, 0);

          //detail.unitPrice += ingredientsPrice;
          detail.ingredientsPrice = ingredientsPrice; // Guardar el precio de los ingredientes en el detalle
        }else{
          detail.ingredientsPrice = 0; // Si no hay ingredientes, establecer a 0
        }

        detail.orderId = order.id; // Asegurarse de que orderId esté asignado

      });
  
      this.order = order;
      //this.updateTotal(); // Recalcular el total correctamente

      // Abrir el modal con los datos cargados
      this.openOrderModalWithData();

      //console.log(this.order);
    });
  }

  //Obtener los items que se venden en el negocio
  getProducts(){
    this.productService.getAll().subscribe((response: HttpResponse<ProductDTO[]>) => {
      this.products = response.body as ProductDTO[]
      //console.log(this.products);
    });
  }

  getCombos(){
    this.combosService.getAll().subscribe((response: HttpResponse<ComboDTO[]>) => {
      this.combos = response.body as ComboDTO[]
      //console.log(this.combos);
    });
  }

  //Funciones para obtener valores de los items
  getProductValue(productId: number, value: keyof ProductDTO): string | number | Date{
    return this.helpersService.getItemValue(this.products, productId, value);
  }

  getComboValue(comboId: number, value: keyof ComboDTO): string | number | Date{
    return this.helpersService.getItemValue(this.combos, comboId, value);
  }

  //Funciones helpers
  formatPrice(price: number): string {
    return this.helpersService.formatPrice(price);
  }  

  //Agregar los items a la orden
  addItemToOrder(itemId: number, itemType: string){
    //console.log(itemId);
    //this.orden.push(itemId);
    //console.log(this.order);

    const item = itemType.toLowerCase() === 'product' ? this.products.find(product => product.id === itemId) : this.combos.find(combo => combo.id === itemId);

    if(item){
      const newOrderDetail = {
        id: 0,
        orderId: this.orderId || this.order.id,
        itemType,
        itemId,
        quantity: 1,
        unitPrice: typeof item.price === 'number' ? item.price : parseFloat(item.price as string),
        orderDetailsIngredients: [],
        dateCreated: new Date()
      }

      this.order.orderDetails.push(newOrderDetail);
      //this.openOrderModal(); // Abrimos el modal para que el usuario pueda editar

      // Recalcular el total
      //this.order.total = this.order.orderDetails.reduce((sum, detail) => sum + detail.quantity * detail.unitPrice, 0);
      //this.updateTotal();

      // Si el modal está abierto, forzar actualización
      if (this.activeDialog) {
        // Actualizar los datos del componente modal
        this.activeDialog.componentInstance.data = { order: { ...this.order } };
        
        // Forzar detección de cambios - esto es clave
        const modalComponent = this.activeDialog.componentInstance;

        if (modalComponent && modalComponent['cdr']) {
          modalComponent['cdr'].detectChanges();
        }
      }

      //console.log(this.order);

      Swal.fire({
        icon: 'success',
        title: 'Agregado Correctamente',
        text: `${item.name} fue añadido correctamente.`,
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  // updateTotal(): void {
  //   this.order.total = this.order.orderDetails.reduce((sum, detail) => {
  //     return sum + (Number(detail.unitPrice) || 0) * (Number(detail.quantity) || 1);
  //   }, 0);
  // }

  //Ya no se utiliza en este componente porque ya se esta utilizando en el form-order en el ngOnInit y en OnChanges
  updateTotal() {
    this.order.total = this.order.orderDetails.reduce((sum, detail) => {
      const detailTotal = ( (detail.unitPrice || 0) * detail.quantity ) + (detail.ingredientsPrice || 0);
      //return sum + (detailTotal * detail.quantity);
      return sum + detailTotal;
    }, 0);
  }

  save(order: CreationOrderDTO): void {

    //console.log(order);

    // Asegurarse de que las fechas estén en formato ISO
    order.dateCreated = new Date(order.dateCreated).toISOString();

    order.orderDetails.forEach(detail => {

      detail.dateCreated = new Date().toISOString();

      detail.orderDetailsIngredients.forEach(ingredient => {
        ingredient.dateCreated = new Date().toISOString();
      });

    });

    if(this.orderId){
      this.orderService.update(this.orderId, order).subscribe({
        next: () => {
          this.router.navigate(['/ordenes']); // Redirigimos después de guardar
        },
        error: err => {
          const errors = extractErrors(err);
          this.errors = errors;
        }
      });
    }else{
      this.orderService.create(order).subscribe({
        next: () => {
          this.router.navigate(['/ordenes']); // Redirigimos después de guardar
        },
        error: err => {
          const errors = extractErrors(err);
          this.errors = errors;
        }
      });
    }
  }
}