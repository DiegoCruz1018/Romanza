import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PaginationDTO } from '../shares/models/PaginationDTO';
import { Observable } from 'rxjs';
import { CreationPermissionDTO, PermissionDTO } from './permissions';
import { buildQueryParams } from '../shares/functions/buildQueryParams';
import { IServiceCRUD } from '../shares/interfaces/service-crud';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService implements IServiceCRUD<PermissionDTO, CreationPermissionDTO> {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/permisos';

  getAll(): Observable<HttpResponse<PermissionDTO[]>>{
    return this.http.get<PermissionDTO[]>(`${this.urlBase}/all`, {observe: 'response'});
  }

  get(pagination: PaginationDTO): Observable<HttpResponse<PermissionDTO[]>> {
    const params = buildQueryParams(pagination);

    return this.http.get<PermissionDTO[]>(this.urlBase, { params, observe: 'response' });
  }

  getById(id: number | string): Observable<PermissionDTO> {
    return this.http.get<PermissionDTO>(`${this.urlBase}/${id}`);
  }

  create(permission: CreationPermissionDTO){
    return this.http.post(this.urlBase, permission);
  }

  update(id: number, permission: CreationPermissionDTO){
    return this.http.put(`${this.urlBase}/${id}`, permission);
  }

  delete(id: number): Observable<PermissionDTO> {
    return this.http.delete<PermissionDTO>(`${this.urlBase}/${id}`);
  }
}
