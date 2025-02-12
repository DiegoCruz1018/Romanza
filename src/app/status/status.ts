export interface StatusBaseDTO{
    name: string;
}

export interface StatusDTO extends StatusBaseDTO{
    id: number;
}

export interface CreationStatusDTO extends StatusBaseDTO{
}