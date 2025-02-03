export interface IngredientBase {
    name: string; 
    price: number | string;
    dateCreated: Date;
}

export interface IngredientDTO extends IngredientBase{
    id: string;
}

export interface CreationIngredientDTO extends IngredientBase{
}