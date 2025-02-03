import { HttpParams } from "@angular/common/http";

// Función para construir parámetros de consulta (query parameters) a partir de un objeto
export function buildQueryParams(obj: any): HttpParams {
    // Inicializamos un objeto HttpParams vacío
    let queryParams = new HttpParams();

    // Recorremos todas las propiedades del objeto 'obj'
    /*
    Qué hace: Comienza un bucle for...in que iterará sobre cada propiedad (clave) del objeto obj.
    En nuestro ejemplo, las propiedades son:
    "page"
    "recordsPerPage"
    */
    for (let property in obj) {
        // Verificamos que la propiedad sea propia del objeto y no heredada
        if (obj.hasOwnProperty(property) && obj[property] !== null && obj[property] !== undefined) {
            // Agregamos cada propiedad y su valor a los parámetros de consulta
            // 'append' devuelve una nueva instancia de HttpParams, por lo que reasignamos 'queryParams'

            //obj[property] accede al valor de la propiedad actual del objeto obj.
            // Por ejemplo: Si property es "page", entonces obj[property] es 2.
            // Si property es "recordsPerPage", entonces obj[property] es 10
            queryParams = queryParams.append(property, obj[property]);

            /*
            Primera iteración (property = "page"):

            obj[property] es 2.

            queryParams = queryParams.append("page", "2");

            queryParams ahora contiene: {"page": "2"}

            Segunda iteración (property = "recordsPerPage"):

            obj[property] es 10.

            queryParams = queryParams.append("recordsPerPage", "10");

            queryParams ahora contiene: {"page": "2", "recordsPerPage": "10"}
            */
        }
    }

    //Ya lo que devolvemos es algo como esto: https://api.example.com/ingredients?page=2&recordsPerPage=10

    // Devolvemos el objeto HttpParams con los parámetros de consulta construidos
    return queryParams;
}
