import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CreationIngredientDTO, IngredientDTO } from './ingredient';
import { Observable } from 'rxjs';
import { PaginationDTO } from '../shares/models/PaginationDTO';
import { buildQueryParams } from '../shares/functions/buildQueryParams';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/ingredientes';

  constructor() { }

  public get(pagination: PaginationDTO): Observable<HttpResponse<IngredientDTO[]>>{
    
    //Llama a la función buildQueryParams para convertir el objeto de paginación
    //en parámetros de consulta HTTP esto genera algo como ?page=1&recordsPerPage=10
    //Ya lo que devolvemos es algo como esto: https://api.example.com/ingredients?page=2&recordsPerPage=10
    let queryParams = buildQueryParams(pagination);

    //params: queryParams: incluye los parámetros de consulta generados (page y recordsPerPage)
    //observe: 'response': Indica que se desea observar la respuesta completa, incluyendo los encabezados HTTP
    return this.http.get<IngredientDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }

  public create(ingredient: CreationIngredientDTO){
    return this.http.post(this.urlBase, ingredient);
  }

  public getForId(id: number): Observable<IngredientDTO>{
    return this.http.get<IngredientDTO>(`${this.urlBase}/${id}`);
  }

  public update(id: number, ingredient: CreationIngredientDTO){
    return this.http.put(`${this.urlBase}/${id}`, ingredient);
  }

  public delete(id: number): Observable<IngredientDTO>{
    return this.http.delete<IngredientDTO>(`${this.urlBase}/${id}`);
  }
}
