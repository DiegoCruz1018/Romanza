import { ProductDTO } from "../products/products";

export interface ComboBaseDTO{
    name: string;
    price: number | string;
    dateCreated: Date;  
}

export interface ComboDTO extends ComboBaseDTO{
    id: number;
    image: string;
}

export interface CreationComboDTO extends ComboBaseDTO{   
    image: File;
    productsIds?: number[];
}

export interface ComboPostGetDTO{
    products: ProductDTO[];
}

export interface ComboPutGetDTO{
    combo: ComboDTO;
    noSelectedProducts: ProductDTO[]
    selectedProducts: ProductDTO[];
}