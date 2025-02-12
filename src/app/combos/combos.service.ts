import { inject, Injectable } from '@angular/core';
import { IServiceCRUD } from '../shares/interfaces/service-crud';
import { ComboDTO, CreationComboDTO } from './combos';
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
  
  public get(pagination: PaginationDTO): Observable<HttpResponse<ComboDTO[]>> {

    let queryParams = buildQueryParams(pagination);

    return this.http.get<ComboDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }

  public getById(id: number): Observable<ComboDTO> {
    return this.http.get<ComboDTO>(`${this.urlBase}/${id}`);
  }

  public create(combo: CreationComboDTO){
    return this.http.post(this.urlBase, combo);
  }

  public update(id: number, combo: CreationComboDTO){
    return this.http.put(`${this.urlBase}/${id}`, combo);
  }

  public delete(id: number): Observable<ComboDTO> {
    return this.http.delete<ComboDTO>(`${this.urlBase}/${id}`);
  }

  
}
