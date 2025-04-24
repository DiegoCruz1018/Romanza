import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CreationProductDTO, ProductDTO, ProductPostGetDTO, ProductPutGetDTO } from './products';
import { buildQueryParams } from '../shares/functions/buildQueryParams';
import { PaginationDTO } from '../shares/models/PaginationDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/productos';

  public getAll(): Observable<HttpResponse<ProductDTO[]>>{
    return this.http.get<ProductDTO[]>(`${this.urlBase}/all`, {observe: 'response'});
  }

  public get(pagination: PaginationDTO): Observable<HttpResponse<ProductDTO[]>>{

    let queryParams = buildQueryParams(pagination);

    return this.http.get<ProductDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }

  public createGet(): Observable<ProductPostGetDTO>{
    return this.http.get<ProductPostGetDTO>(`${this.urlBase}/postget`);
  }

  public create(product: CreationProductDTO): Observable<ProductDTO>{

    const formData = this.buildFormData(product);

    return this.http.post<ProductDTO>(this.urlBase, formData);
  }

  public updateGet(id: number): Observable<ProductPutGetDTO>{
    return this.http.get<ProductPutGetDTO>(`${this.urlBase}/putget/${id}`);
  }

  public update(id: number, product: CreationProductDTO){
    const formData = this.buildFormData(product);

    return this.http.put(`${this.urlBase}/${id}`, formData);
  }

  public delete(id: number): Observable<ProductDTO>{
    return this.http.delete<ProductDTO>(`${this.urlBase}/${id}`);
  }

  private buildFormData(product: CreationProductDTO): FormData{
   
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    
    if(product.image){
      formData.append('image', product.image);
    }

    formData.append('ingredientsIds', JSON.stringify(product.ingredientsIds));

    return formData;
  }
}
