import { ChangeDetectorRef, Component, inject, Inject, Input, numberAttribute, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CreationOrderDTO, OrderDTO } from '../Orders';
import { FormOrderComponent } from "../form-order/form-order.component";
import { MatIconModule } from '@angular/material/icon';
import { ComboDTO } from '../../combos/combos';
import { ProductDTO } from '../../products/products';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";

@Component({
  selector: 'app-create-order-modal',
  imports: [MatDialogModule, FormOrderComponent, MatIconModule, ShowErrorsComponent],
  templateUrl: './create-order-modal.component.html',
  styleUrl: './create-order-modal.component.css'
})
export class CreateOrderModalComponent implements OnInit, OnChanges{

  constructor(
    public dialogRef: MatDialogRef<CreateOrderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: OrderDTO },
    public cdr: ChangeDetectorRef // Inyectar el ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //console.log(this.data.order);
  }

  // En CreateOrderModalComponent
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.cdr.detectChanges(); // Forzar detección de cambios
    }
  }

  // También agregar un método para actualizar los datos manualmente
  updateOrderData(order: OrderDTO): void {
    this.data = { order: { ...order } };
    this.cdr.detectChanges();
  }

  products: ProductDTO[] = [];
  combos: ComboDTO[] = []; 
  errors: string[] = [];

  // Guardar la orden 
  save(order: CreationOrderDTO): void {
    //console.log('Datos enviados al backend:', order); // Verifica el objeto antes de enviarlo

    this.dialogRef.close(order);

    //console.log(this.order);
  }

  // Cerrar el modal
  close(): void {
    this.dialogRef.close();
  }
}