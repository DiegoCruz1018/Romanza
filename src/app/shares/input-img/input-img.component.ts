import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { toBase64 } from '../functions/toBase64';

@Component({
  selector: 'app-input-img',
  imports: [MatButtonModule],
  templateUrl: './input-img.component.html',
  styleUrl: './input-img.component.css'
})
export class InputImgComponent {

  @Input({required: true})
  title!: string;

  @Input()
  urlCurrentImage?: string;

  @Output()
  fileSelected = new EventEmitter<File>();

  //Es para que se muestre en pantalla la imagen que seleccionamos
  //Puede ser nulo porque podemos no tener una imagen seleccionada

  //Base 64 es un formato en el que podemos representar un arreglo de bytes
  //Pero en formato de string, entonces la imagen la convertiremos de un arreglo de bytes
  //a una representación en string
  imageBase64?: string;

  changeToBase64(event: Event){

    //Convierte el evento en un objeto HTMLInputElement para poder acceder al archivo seleccionado.

    /*
    event es el objeto que contiene información sobre el evento que ha ocurrido 
    (en este caso, el cambio en el campo de entrada de archivo).
    
    target es una propiedad del objeto event que hace referencia al elemento en el 
    que se produjo el evento. En este caso, event.target se refiere al elemento <input type="file">.
    
    as HTMLInputElement: Esto es una "aserción de tipo" en TypeScript. Le está diciendo 
    al compilador que trate event.target como si fuera un objeto de tipo HTMLInputElement.
    Esto es útil cuando estás seguro del tipo del elemento con el que estás trabajando, 
    pero el compilador no puede inferirlo automáticamente.

    En este caso, estás asegurándote de que event.target sea tratado como un HTMLInputElement, 
    lo que te permite acceder a propiedades y métodos específicos de los elementos de entrada HTML, como files.
    */
    const input = event.target as HTMLInputElement;

    //Me traen el elemento input
    // console.log(event.target);
    // console.log(input);

    /*
      input.files es una lista de archivos que es un objeto de tipo FileList.

      Este objeto contiene una colección de File objetos que representan los archivos seleccionados por el usuario.

      Propiedades de FileList:

        length: Devuelve el número de archivos seleccionados.
        item(index): Método que devuelve el archivo en la posición especificada.

      Objeto File:

        Cada File objeto tiene propiedades como:
        name: El nombre del archivo.
        size: El tamaño del archivo en bytes.
        type: El tipo MIME del archivo (por ejemplo, image/png).
        lastModified: La fecha en que el archivo fue modificado por última vez.
    */

    if(input.files && input.files.length > 0){

      //[0] el primer archivo de input.files
      const file: File = input.files[0];

      //Convertir a base64
      toBase64(file).then((value: string) => this.imageBase64 = value)
      .catch(error => console.log(error));

      //Emite el objeto file cuando el formulario es enviado exitosamente
      this.fileSelected.emit(file);

      //Si el usuario selecciona una nueva imagen pues se elimine la UrlImagenActual
      this.urlCurrentImage = undefined;
    }
  }
}
