import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CreationOrderDTO, OrderDTO } from './Orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor() { }

  private http = inject(HttpClient);
  private ulrBase = environment.apiURL + '/ordenes';

  public get(filter: string, params: any): Observable<HttpResponse<OrderDTO[]>>{

    //const params = new HttpParams().set('dateFilter', filter);
    //console.log(params.toString());

    //Crear una instancia de HttpParams y agregar el filter
    let httpParams = new HttpParams().set('filter', filter);

    // Agregar los demás parámetros (si existen)
    for(const key in params){
      //console.log(key);
      if(params.hasOwnProperty(key)){
        httpParams = httpParams.append(key, params[key]);
        // console.log(params);
        // console.log(key);
        // console.log(params[key]);
        //console.log(key, params[key]);
        //console.log(httpParams);
      }
    }
    
    //console.log(this.ulrBase, {params: httpParams, observe: 'response'});
    return this.http.get<OrderDTO[]>(this.ulrBase, {params: httpParams, observe: 'response'});
  }

  public getOrderById(orderId: number): Observable<OrderDTO>{
    return this.http.get<OrderDTO>(`${this.ulrBase}/${orderId}`);
  }

  public create(order: CreationOrderDTO): Observable<OrderDTO>{
    return this.http.post<OrderDTO>(this.ulrBase, order);
  }

  public deliverOrder(orderId: number){
    return this.http.patch(`${this.ulrBase}/${orderId}/deliver`, {});
  }

  public update(orderId: number, order: CreationOrderDTO): Observable<OrderDTO>{
    return this.http.put<OrderDTO>(`${this.ulrBase}/${orderId}`, order);
  }

  public delete(orderId: number){
    return this.http.delete(`${this.ulrBase}/${orderId}`);
  }
}