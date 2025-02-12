export interface ComboBaseDTO{
    name: string;
    price: number | string;
    dateCreated: Date;  
}

export interface ComboDTO extends ComboBaseDTO{
    id: number;
}

export interface CreationComboDTO extends ComboBaseDTO{
    
}