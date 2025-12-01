import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OrderRequest } from '@core/models/order.model';
import { OrderStoreService } from '@core/services/order-store.service';


@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css'
})
export class OrderCard {
  @Input() order!: OrderRequest

  private orderStoreService = inject(OrderStoreService);
  // private _fb = inject(FormBuilder)
  
  // updateForm = this._fb.group({
  //   status: this._fb.control<string>(this.order.status),
    
  // })

  updateOrder(){

  }
  saveOrderChanges(){

  }
}
