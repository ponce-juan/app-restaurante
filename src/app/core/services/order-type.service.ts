import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderType } from '@models/order.types.model';

@Injectable({
  providedIn: 'root'
})
export class OrderTypeService {
  
  private apiUrl = environment.baseUrl+environment.endpoints.orderTypes;
  private http = inject(HttpClient);

  //Obtengo la lista de tipos de ordenes cargadas
  getOrderTypes(): Observable<OrderType[]>{
    return this.http.get<OrderType[]>(this.apiUrl);
  }

  //Agrego un nuevo tipo de orden
  addOrderType(newOrderType : OrderType): Observable<OrderType> {
    return this.http.post<OrderType>(this.apiUrl, newOrderType);
  }

  //Actualizo el tipo de orden
  updateOrderType(newOrderType: OrderType, orderId: number): Observable<OrderType>{
    return this.http.put<OrderType>(`${this.apiUrl}/${orderId}`, newOrderType);
  }

  //Elimino tipo de orden por ID
  deleteOrderType(orderId: number){
    return this.http.delete(`${this.apiUrl}/${orderId}`)
  }

}
