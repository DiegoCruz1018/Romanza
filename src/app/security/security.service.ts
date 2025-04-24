import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CredentialsUsersDTO, LoginDTO, ResponseAuthenticationDTO, UserDTO, UserPostGetDTO, UserPutGetDTO } from './security';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { PaginationDTO } from '../shares/models/PaginationDTO';
import { buildQueryParams } from '../shares/functions/buildQueryParams';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/usuarios';
  private readonly keyToken = 'token';
  private readonly keyExpiration = 'token-expiration';
  private router = inject(Router);
  private permissions: string[] = [];

  // isLogged(): boolean{
  //   return false;
  // }

  // getRol(): string{
  //   return 'admin';
  // }

  public getAll(): Observable<HttpResponse<UserDTO[]>>{
    return this.http.get<UserDTO[]>(`${this.urlBase}/all`, {observe: 'response'});
  }

  get(pagination: PaginationDTO): Observable<HttpResponse<UserDTO[]>>{
    
    let queryParams = buildQueryParams(pagination);

    return this.http.get<UserDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }

  getToken(): string | null{
    return localStorage.getItem(this.keyToken);
  }

  getPermissions(): string[] {

    //console.log(this.permissions);

    return this.permissions;
  }

  loadPermissions(): Observable<string[]>{

    const userId = this.getFieldJWT('id');

    if (!userId) return of([]);

    return this.http.get<string[]>(`${this.urlBase}/${userId}/permissions`)
      .pipe(
        tap(perms => this.permissions = perms)
      );
  }
  
  hasPermission(permission: string): boolean {
    //console.log(this.permissions.includes(permission));
    return this.permissions.includes(permission);
  }

  getById(id: string | null): Observable<UserDTO>{
    return this.http.get<UserDTO>(`${this.urlBase}/${id}`);
  }

  createGet(): Observable<UserPostGetDTO>{
    return this.http.get<UserPostGetDTO>(`${this.urlBase}/postget`);
  }

  register(credentials: CredentialsUsersDTO): Observable<ResponseAuthenticationDTO>{

    const formData = this.buildFormData(credentials);

    return this.http.post<ResponseAuthenticationDTO>(`${this.urlBase}/registrar`, formData);
      // .pipe(
      //   tap((responseAuthentication => this.saveToken(responseAuthentication)))
      // );
  }

  updateGet(id: string): Observable<UserPutGetDTO>{
    return this.http.get<UserPutGetDTO>(`${this.urlBase}/putget/${id}`);
  }

  update(id: string, credentials: CredentialsUsersDTO): Observable<ResponseAuthenticationDTO>{
    const formData = this.buildFormData(credentials);

    return this.http.put<ResponseAuthenticationDTO>(`${this.urlBase}/${id}`, formData);
      // .pipe(
      //   tap((responseAuthentication) => this.saveToken(responseAuthentication))
      // );
  }

  delete(id: string | null): Observable<UserDTO>{
    return this.http.delete<UserDTO>(`${this.urlBase}/${id}`);
  }

  login(credentials: LoginDTO): Observable<ResponseAuthenticationDTO>{
    return this.http.post<ResponseAuthenticationDTO>(`${this.urlBase}/login`, credentials)
      .pipe(
        tap((responseAuthentication => this.saveToken(responseAuthentication)))
      );
  }  

  //Cuando nos devuelve el token, queremos guardarlo en local storage, local storage es un mecanismo para
  //guardar información en el navegador del usuario, ejemplo: si el usuario sale de la aplicación y vuelve entrar
  //tengamos el token a mano
  saveToken(responseAuthentication: ResponseAuthenticationDTO){
    localStorage.setItem(this.keyToken, responseAuthentication.token);
    localStorage.setItem(this.keyExpiration, responseAuthentication.expiration.toString());
  }

  getFieldJWT(field: string): string{

    const token = localStorage.getItem(this.keyToken);

    if(!token){return ''};

    //El JWT se compone de tres partes: el encabezado (header), el payload (carga útil) y la firma (signature).


    //Convertimos a un objeto javascript JSON.parse
    //atob()es una función que decodifica una cadena que ha sido codificada en Base64.
    //Resultado: La carga útil del token, decodificada de su formato Base64 a una cadena JSON.
    //token.split('.')[1] Propósito: Dividir el token en sus tres partes.
    //Qué Hace: La función split('.') separa el token en un array de tres cadenas, usando el punto (.) como separador.
    //Resultado: Un array donde:
    //token.split('.')[0] es el encabezado.
    //token.split('.')[1] es la carga útil (payload). 
    //El payload es la parte del JWT (JSON Web Token) que contiene los claims o campos con información sobre el usuario. ejemplo (name, lastnema o email)
    //token.split('.')[2] es la firma.
    //atob(token.split('.')[1]): Decodifica la segunda parte (carga útil) de Base64 a una cadena JSON.
    //JSON.parse(atob(token.split('.')[1])): Convierte la cadena JSON en un objeto JavaScript.

    //Lo separamos por puntos y buscamos la segunda parte[1] del token
    //que es la que contiene los claims
    //console.log(token);
    const dataToken = JSON.parse(atob(token.split('.')[1]));
    //console.log(token.split('.')[1])
    //console.log(atob(token.split('.')[1]));
    //console.log(JSON.parse(atob(token.split('.')[1])));
    //console.log(dataToken.name);

    //console.log(dataToken);

    return dataToken[field];
  }

  isLogged(): boolean{
    const token = localStorage.getItem(this.keyToken);

    if(!token){
      return false;
    }

    //Usamos el ! porque deberiamos de tener siempre una fecha
    const expiration = localStorage.getItem(this.keyExpiration)!;
    const dateExpiration = new Date(expiration);

    if(dateExpiration <= new Date()){

      //Hacemos logout para eliminar el token, si el token ya expiro no tiene sentido tenerlo en localStorage
      this.logout();

      return false;
    }

    return true;
  }

  logout(){
    localStorage.removeItem(this.keyToken);
    localStorage.removeItem(this.keyExpiration);
    this.router.navigate(['/']);
  }
  
  getRol(): string[]{

    const field: string = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

    const roles = this.getFieldJWT(field);

    //console.log(roles);

    //Si roles es un array, retornamos el primer elemento. Si es un string, lo retornamos tal cual.
    if (Array.isArray(roles)) {
      //console.log(roles);
      return roles;
    } else if (typeof roles === 'string') {
      //console.log(roles);
      return [roles];
    }

    //return 'administrador';

    // Si no hay roles, retornamos un array vacío
    return [];
  }

  buildFormData(user: CredentialsUsersDTO): FormData{

    const formdata = new FormData();

    formdata.append('name', user.name);
    formdata.append('lastname', user.lastname);
    formdata.append('phonenumber', user.phonenumber);
    formdata.append('email', user.email);
    formdata.append('password', user.password? user.password : '');

    formdata.append('rolesIds', JSON.stringify(user.rolesIds));

    return formdata;
  }
}
