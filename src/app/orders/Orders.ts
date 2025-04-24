import { IngredientDTO } from "../ingredients/ingredient";
import { UserDTO } from "../security/security";
import { StatusDTO } from "../status/status";

export interface OrderBaseDTO{
    clientName: string;
    clientPhoneNumber: string;
    total: number;
    userId: string;
    statusId: number;
    orderDetails: OrderDetailsDTO[];
    dateCreated: Date | string;
}

export interface OrderDTO extends OrderBaseDTO{
    id: number;
}

export interface CreationOrderDTO extends OrderBaseDTO{
}

export interface OrderDetailsDTO{
    id: number;
    orderId: number;
    itemType: string;
    itemId: number;
    quantity: number;
    unitPrice: number;
    orderDetailsIngredients: OrderDetailsIngredientsDTO[];
    ingredientsPrice?: number; //SIrve para obtener el precio de los ingredientes
    dateCreated: Date | string;
}

export interface OrderDetailsIngredientsDTO{
    id?: number;
    orderDetailsId?: number;
    ingredientId?: number;
    quantity?: number;
    unitPrice?: number;
    dateCreated: Date | string;
}