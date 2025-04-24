import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }

  getItemValue<T extends { id: number | string }, K extends keyof T>(
    items: T[] | undefined,   // El arreglo de objetos donde queremos buscar.
    itemId: number | string,  // El ID del objeto que queremos buscar.
    value: K   // El nombre de la propiedad del objeto cuyo valor queremos retornar.
  ): T[K] | string { // La función retorna el valor de la propiedad (tipo T[K]) o un string de error.

    const item = items?.find(item => item.id === itemId);

    if (item && item[value] !== undefined) {
      return item[value];
    }

    return 'Item no encontrado';
  }
}
