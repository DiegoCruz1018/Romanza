import { inject, Injectable } from '@angular/core';
import { IServiceCRUD } from '../shares/interfaces/service-crud';
import { ComboDTO, ComboPostGetDTO, ComboPutGetDTO, CreationComboDTO } from './combos';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationDTO } from '../shares/models/PaginationDTO';
import { environment } from '../../environments/environment.development';
import { buildQueryParams } from '../shares/functions/buildQueryParams';

@Injectable({
  providedIn: 'root'
})
export class CombosService implements IServiceCRUD<ComboDTO, CreationComboDTO>{

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/combos';

  public getAll(): Observable<HttpResponse<ComboDTO[]>> {
    return this.http.get<ComboDTO[]>(`${this.urlBase}/all`,  {observe: 'response'});
  }
  
  public get(pagination: PaginationDTO): Observable<HttpResponse<ComboDTO[]>> {

    let queryParams = buildQueryParams(pagination);

    return this.http.get<ComboDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }

  public getById(id: number): Observable<ComboDTO> {
    return this.http.get<ComboDTO>(`${this.urlBase}/${id}`);
  }

  public createGet(): Observable<ComboPostGetDTO>{
    return this.http.get<ComboPostGetDTO>(`${this.urlBase}/postget`);
  }

  public create(combo: CreationComboDTO): Observable<ComboDTO>{
    
    const formData = this.buildFormData(combo);

    return this.http.post<ComboDTO>(this.urlBase, formData);
  }

  public updateGet(id: number): Observable<ComboPutGetDTO>{
    return this.http.get<ComboPutGetDTO>(`${this.urlBase}/putget/${id}`);
  }

  public update(id: number, combo: CreationComboDTO){

    const formData = this.buildFormData(combo);

    return this.http.put(`${this.urlBase}/${id}`, formData);
  }

  public delete(id: number): Observable<ComboDTO> {
    return this.http.delete<ComboDTO>(`${this.urlBase}/${id}`);
  }

  private buildFormData(combo: CreationComboDTO){
    
    const formData = new FormData();

    formData.append('name', combo.name);
    formData.append('price', combo.price.toString());

    if(combo.image){
      formData.append('image', combo.image);
    }

    formData.append('productsIds', JSON.stringify(combo.productsIds));

    return formData;
  }  
}
