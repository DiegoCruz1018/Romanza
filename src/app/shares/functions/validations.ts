import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function firstLetterUpperCase(): ValidatorFn{

    return(control: AbstractControl): ValidationErrors | null => {
        const value = <string>control.value;

        if(!value) return null;

        if(value.length === 0) return null;

        const firstLetter = value[0];

        if(firstLetter !== firstLetter.toUpperCase()){
            return {
                firstLetterUpperCase: {
                    message: 'La primera letra debe de ser mayúscula'
                }
            }
        }

        return null;
    }
}

export function priceMustNotBeLessThanZero(): ValidatorFn{
    return(control: AbstractControl): ValidationErrors | null => {
        const priceSelected = <number>control.value;

        if(!priceSelected) return null;

        if(priceSelected <= 0){
            return {
                priceMustNotBeLessThanZero: {
                    message: 'El precio no es válido'
                }
            }
        }

        return null;
    }
}