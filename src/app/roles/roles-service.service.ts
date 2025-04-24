import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreationRoleDTO, RoleDTO, RolePostGetDTO, RolePutGetDTO } from './roles';
import { PaginationDTO } from '../shares/models/PaginationDTO';
import { buildQueryParams } from '../shares/functions/buildQueryParams';
import { IServiceCRUD } from '../shares/interfaces/service-crud';

@Injectable({
  providedIn: 'root'
})
export class RolesService implements IServiceCRUD<RoleDTO, CreationRoleDTO>{

  constructor() { }
  
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/roles';

  get(pagination: PaginationDTO): Observable<HttpResponse<RoleDTO[]>> {
    let queryParams = buildQueryParams(pagination);

    return this.http.get<RoleDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }

  getById(id: string): Observable<RoleDTO> {
    return this.http.get<RoleDTO>(`${this.urlBase}/${id}`);
  }

  createGet(): Observable<RolePostGetDTO>{
    return this.http.get<RolePostGetDTO>(`${this.urlBase}/postget`);
  }
  
  create(role: CreationRoleDTO){

    const formData = this.buildFormData(role);

    return this.http.post(this.urlBase, formData);
  }

  updateGet(id: string): Observable<RolePutGetDTO>{
    return this.http.get<RolePutGetDTO>(`${this.urlBase}/putget/${id}`);
  }

  update(id: string, role: CreationRoleDTO){
    return this.http.put(`${this.urlBase}/${id}`, role);
  }

  delete(id: number): Observable<RoleDTO> {
    return this.http.delete<RoleDTO>(`${this.urlBase}/${id}`);
  }

  buildFormData(role: CreationRoleDTO): FormData{

    const formData = new FormData();

    formData.append('name', role.name);

    // console.log(role.permissionsIds);
    // console.log(JSON.stringify(role.permissionsIds));

    formData.append('permissionsIds', JSON.stringify(role.permissionsIds));

    return formData;
  }

}
