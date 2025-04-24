import { inject, Injectable } from '@angular/core';
import { IServiceCRUD } from '../shares/interfaces/service-crud';
import { CreationStatusDTO, StatusDTO } from './status';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationDTO } from '../shares/models/PaginationDTO';
import { environment } from '../../environments/environment.development';
import { buildQueryParams } from '../shares/functions/buildQueryParams';
import { RoleDTO } from '../roles/roles';

@Injectable({
  providedIn: 'root'
})
export class StatusService implements IServiceCRUD<StatusDTO, CreationStatusDTO>{

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/status';

  constructor() { }

  public getAll(): Observable<HttpResponse<StatusDTO[]>> {
    return this.http.get<StatusDTO[]>(`${this.urlBase}/all`, {observe: 'response'});
  }

  public get(pagination: PaginationDTO): Observable<HttpResponse<RoleDTO[]>> {

    let queryParams = buildQueryParams(pagination);

    return this.http.get<StatusDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }

  public getById(id: number): Observable<StatusDTO> {
    return this.http.get<StatusDTO>(`${this.urlBase}/${id}`);
  }

  public create(status: CreationStatusDTO){
    return this.http.post(this.urlBase, status);
  }

  public update(id: number, status: CreationStatusDTO){
    return this.http.put(`${this.urlBase}/${id}`, status);
  }

  public delete(id: number): Observable<StatusDTO> {
    return this.http.delete<StatusDTO>(`${this.urlBase}/${id}`);
  }
}
