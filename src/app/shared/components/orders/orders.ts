import { Component, DestroyRef, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { Product } from '@models/products.model';
import {Order, Table } from '@models/table.model';
import { FormsModule} from '@angular/forms';
import { OrderType } from '@models/order.types.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderTypeService } from '@services/order-type.service';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit{
  
  private _destroyRef: DestroyRef = inject(DestroyRef);
  private _orderTypesService = inject(OrderTypeService);

  @Input() table!: Table;
  
  public orderTypes = signal<OrderType[]>([]);

  selectedProduct: Product | null = null;
  newOrder: Order = {} as Order;

  ngOnInit(){
    this.loadOrderTypes();
    this.newOrder.type = this.orderTypes()[0];
  }

  //Carga de tipo de orden desde db
  private loadOrderTypes(): void {
    this._orderTypesService.getOrderTypes()
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: (types) => {
        console.log(types)
        this.orderTypes.set(types);
      },
      error: (err) => {
        console.error("Error al obtenes los tipos de ordenes: ", err);
        this.orderTypes.set([]);
      }
    })
  }

  onSelectProduct(product : Product){
    this.selectedProduct = product;
  }

  submitFormNewOrder(): void {

  }

  cancelOrder(): void {
    
  }


}
