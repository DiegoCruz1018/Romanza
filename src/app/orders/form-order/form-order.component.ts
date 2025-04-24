import { Component, DoCheck, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstLetterUpperCase } from '../../shares/functions/validations';
import { CreationOrderDTO, OrderDetailsDTO, OrderDTO } from '../Orders';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StatusDTO } from '../../status/status';
import { StatusService } from '../../status/status.service';
import { HttpResponse } from '@angular/common/http';
import { ProductDTO } from '../../products/products';
import { HelpersService } from '../../shares/functions/helpers.service';
import { ComboDTO } from '../../combos/combos';
import { MatDividerModule } from '@angular/material/divider';
import { IngredientDTO } from '../../ingredients/ingredient';
import { IngredientService } from '../../ingredients/ingredient.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IngredientsModalComponent } from '../ingredients-modal/ingredients-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-order',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatDividerModule, MatIconModule, SweetAlert2Module],
  templateUrl: './form-order.component.html',
  styleUrl: './form-order.component.css'
})
export class FormOrderComponent implements OnInit, OnChanges{

  constructor(
    private dialogRef: MatDialogRef<FormOrderComponent> // Inyección del MatDialogRef
  ) {}

  ngOnInit(): void {
    if(this.model !== undefined){
      this.form.patchValue(this.model);
    }

    if (!this.model.orderDetails) {
      this.model.orderDetails = []; // Aseguramos inicialización de orderDetails
    }  

    this.getStatus();
    this.getIngredients();
    this.updateTotal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      this.form.patchValue({
        clientName: this.model.clientName,
        clientPhoneNumber: this.model.clientPhoneNumber,
        statusId: this.model.statusId,
        dateCreated: this.model.dateCreated,
        total: this.model.total
      });
      this.updateTotal(); // Recalcular el total
    }
  }

  private dialog = inject(MatDialog);

  openIngredientsModal(event: Event, orderDetail: OrderDetailsDTO){

    event.preventDefault(); // Evita el comportamiento de envío del formulario

     // Pasar ingredientes actuales del detalle al modal junto con sus precios
    const ingredientsWithPrices = orderDetail.orderDetailsIngredients.map(ing => ({
      ingredient: this.ingredients.find(i => i.id === ing.ingredientId), // Busca el ingrediente en la lista general
      quantity: ing.quantity,
      unitPrice: ing.unitPrice // Asegúrate de incluir el precio aquí
    }));

    const dialogRef = this.dialog.open(IngredientsModalComponent, {
      width: '400px',
      data: { ingredients: this.ingredients, selectedIngredients: ingredientsWithPrices }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        //console.log('Ingredientes agregados:', result);
        this.addIngredientsToOrderDetail(orderDetail, result);
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close(); // Cierra el modal
  }

  private formBuilder = inject(FormBuilder);
  private statusService = inject(StatusService);
  private ingredientService = inject(IngredientService);
  private helpersService = inject(HelpersService);

  status: StatusDTO[] = [];
  ingredients: IngredientDTO[] = [];

  @Input()
  model!: OrderDTO;

  @Input()
  products: ProductDTO[] = [];

  @Input()
  combos: ComboDTO[] = []; 

  @Output()
  postForm = new EventEmitter<CreationOrderDTO>();

  form = this.formBuilder.group({
    clientName: ['', {validators: [Validators.required, Validators.maxLength(30), firstLetterUpperCase()]}],
    clientPhoneNumber: ['', {validators: [Validators.pattern(/^\d{10}$/)]}],
    statusId: [this.model?.statusId || 1, Validators.required],
    dateCreated: [this.model?.dateCreated || new Date()],
    total: [this.model?.total || 0, {validators: [Validators.required, Validators.min(0)]}],
  });

  getNameErrors(): string{
    let name = this.form.controls.clientName;

    if(name.hasError('required')){
      return 'El nombre del cliente es obligatorio';
    }

    if(name.hasError('maxLength')){
      return `El nombre no puede tener más de ${name.getError('maxLength').requiredLength} caracteres`;
    }

    if(name.hasError('firstLetterUpperCase')){
      return name.getError('firstLetterUpperCase').message;
    }

    return "";
  }

  getStatusErrors(): string{
    let status = this.form.controls.statusId;

    if(status.hasError('required')){
      return 'El estatus de la orden es obligatorio';
    }

    return '';
  }

  getStatus(){
    this.statusService.getAll().subscribe((response: HttpResponse<StatusDTO[]>) => {
      this.status = response.body as StatusDTO[];
      //console.log(this.status);
    })
  }

  getIngredients(){
    this.ingredientService.getAll().subscribe((response: HttpResponse<IngredientDTO[]>) => {
      this.ingredients = response.body as IngredientDTO[];
      //console.log(this.ingredients);
    });
  }

  getProductValue(productId: number, value: keyof ProductDTO): string | number | Date{
    return this.helpersService.getItemValue(this.products, productId, value);
  }

  getComboValue(comboId: number, value: keyof ComboDTO){
    return this.helpersService.getItemValue(this.combos, comboId, value);
  }

  getIngredientValue(ingredientId: number, value: keyof IngredientDTO){
    return this.helpersService.getItemValue(this.ingredients, ingredientId, value);
  }

  formatPrice(price: number){
    return this.helpersService.formatPrice(price);
  }

  //Eliminar un producto o combo de la orden
  removeItemFromOrder(event: Event, index: number){
    
    event.preventDefault();

    // Elimina el producto/combo del array usando el índice
    this.model.orderDetails.splice(index, 1);

    //Recalcular el total de la orden
    //this.model.total = this.model.orderDetails.reduce((sum, detail) => sum + detail.unitPrice * detail.quantity, 0);
    this.updateTotal(); // Actualiza el total del formulario
  }

  addIngredientsToOrderDetail(orderDetail: OrderDetailsDTO, ingredients: { ingredient: IngredientDTO, quantity: number, unitPrice: number}[]){

    ingredients.forEach(ing => {
      
      const newIngredient = {
        id: 0,
        orderDetailsId: orderDetail.id,
        ingredientId: ing.ingredient.id,
        quantity: ing.quantity,
        unitPrice: ing.unitPrice ?? Number(ing.ingredient.price), // Usa unitPrice si viene en el objeto, si no usa ingredient.price,
        dateCreated: new Date()
      }

      orderDetail.orderDetailsIngredients.push(newIngredient);
      //orderDetail.unitPrice += newIngredient.unitPrice * ing.quantity; // Recalculamos el precio del detalle
    });

    // Recalcular el precio de los ingredientes y asignarlo a ingredientsPrice
    orderDetail.ingredientsPrice = orderDetail.orderDetailsIngredients.reduce((sum, ingredient) => {
      return sum + (ingredient.unitPrice || 0) * (ingredient.quantity || 1);
    }, 0);

    // Recalcular el total del pedido
    //this.model.total = this.model.orderDetails.reduce((sum, detail) => { return sum + detail.unitPrice * detail.quantity;}, 0);
    this.updateTotal(); // Actualiza el total del formulario
  }

  removeIngredientFromOrderDetails(event: Event, orderDetail: OrderDetailsDTO, index: number){
    
    event.preventDefault();

    //Obtener el ingrediente que se va a eliminar
    //const ingredientToRemove = orderDetail.orderDetailsIngredients[index];
    orderDetail.orderDetailsIngredients.splice(index, 1); // Eliminar el ingrediente del array

    // Recalcular el precio de los ingredientes
    orderDetail.ingredientsPrice = orderDetail.orderDetailsIngredients.reduce((sum, ingredient) => {
      return sum + (ingredient.unitPrice || 0) * (ingredient.quantity || 1);
    }, 0);

    //Recalculamos el total
    //this.model.total = this.model.orderDetails.reduce((sum, detail) => {return sum + detail.unitPrice * detail.quantity}, 0);
    this.updateTotal(); // Actualiza el total del formulario
  }

  updateTotal(): void {
    const total = this.model.orderDetails.reduce((sum, detail) => {
      const detailTotal = (Number(detail.unitPrice) || 0) + (Number(detail.ingredientsPrice) || 0);
      return sum + (detailTotal * (Number(detail.quantity) || 1));
    }, 0);
    
    this.model.total = total;
    this.form.patchValue({ total });
  }  

  save(){
    if (this.form.valid) {

      // Recalcula el total antes de emitir
      //this.updateTotal();

      if(this.model.orderDetails.length === 0){
        Swal.fire({
          icon: 'warning',
          title: 'Error al crear orden',
          text: 'No hay productos ni combos seleccionados',
          showConfirmButton: true
        });
      }

      // if(this.model.statusId === 0){
      //   Swal.fire({
      //     icon: 'warning',
      //     title: 'Error al crear orden',
      //     text: 'No seleccionaste el estatus de la orden',
      //     showConfirmButton: true
      //   });
      // }

      const order = { ...this.model, ...this.form.value } as CreationOrderDTO;
      //console.log(order);

      //console.log('Formulario enviado:', this.form.value);

      this.postForm.emit(order);

      // Emitir los datos o pasarlos al servicio correspondiente
    } else {
      console.error('Formulario inválido:', this.form.errors);
    }
  }
}
