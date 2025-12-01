import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Order, OrderRequest, OrderStatus } from '@core/models/order.model';
import { environment as env} from '@environment/environments';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderStoreService {
  
  private http = inject(HttpClient)
  private api = env.baseUrl+env.endpoints.orderCustomers;
  private _orders = signal<OrderRequest[]>([]);
  public orders = computed(() => this._orders());

  constructor(){

  }

  private mapToOrderRequest(order: Order): OrderRequest {
    return {
      id: order.id,
      // client: order.client,
      type: order.type,
      items: order.items,
      status: order.status.status,
      total: order.total
    };
  }

  public loadOrders(): Observable<OrderRequest[]>{
    return this.http.get<Order[]>(this.api)
    .pipe(
      map(orders => orders.map(order => {
        const mappedOrder =this.mapToOrderRequest(order);
        // console.log("Original Order: ", order);
        // console.log("Mapped Order: ", mappedOrder);
        return mappedOrder;
      })),
      tap(ordersReq => this._orders.set(ordersReq))
    )
  }


//   Order {
//   id: number;
//   client?: string;
//   type: OrderType{id:number, type:"TAKE_AWAY" | "DELIVERY" | "DINE_IN"};
//   items: Item[{name:string, quantity:number, price:number}];
//   status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
//   total: number;
// }
  addOrder(order: OrderRequest): Observable<Order>{
    // this._orders.update(orders => [...orders, order]);
    console.log("add orden en  bd");
    return this.http.post<Order>(this.api, order).pipe(
      tap(res => {
        this._orders.update(orders => [...orders, this.mapToOrderRequest(res)]);
      })
    )
  }

  updateOrder(order: OrderRequest): Observable<Order>{
    this._orders.update(orders => {
      const index = orders.findIndex(o => o.id === order.id);
      if(index !== -1){
        orders[index] = order;
      }
      return [...orders];
    });
    return this.http.put<Order>(`${this.api}/${order.id}`, order);
  }

  updateOrderStatus(orderId: number, status: OrderRequest["status"]): Observable<Order>{
    this._orders.update(orders => {
      const index = orders.findIndex(o => o.id === orderId);
      if(index !== -1){
        orders[index].status = status;
      }
      return [...orders];
    });
    return this.http.put<Order>(`${this.api}/${orderId}/status`, { status });
  }
}
