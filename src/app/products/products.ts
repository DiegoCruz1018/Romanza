import { IngredientDTO } from "../ingredients/ingredient";

export interface ProductBaseDTO{
    name: string,
    price: number | string;
    dateCreated: Date;
}

export interface ProductDTO extends ProductBaseDTO{
    id: number;
    image: string;
}

export interface CreationProductDTO extends ProductBaseDTO{
    image: File;
    ingredientsIds?: number[];
}

export interface ProductPostGetDTO{
    ingredients: IngredientDTO[];
}

export interface ProductPutGetDTO{
    product: ProductDTO,
    selectedIngredients: IngredientDTO[];
    noSelectedIngredients: IngredientDTO[];
}