import { Component, inject, OnInit, signal } from '@angular/core';
import { Orders } from '@components/orders/orders';
import { Order } from '@core/models/order.model';
import { OrderStoreService } from '@core/services/order-store.service';
import { ProductService } from '@core/services/product.service';
import { Product } from '@models/products.model';
import { OrderCarousel } from "@shared/components/order-carousel/order-carousel";

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [Orders, OrderCarousel],
  templateUrl: './orders-management.html',
  styleUrl: './orders-management.css'
})
export class OrdersManagement{

  
  showNewOrder = signal<boolean>(false);
  loading = signal<boolean>(true);
  errormsg = signal<string | null>(null);

  onCloseForm(){
    this.showNewOrder.update(v => v=false);
  }
  
  ngOnInit(){
    
  }
 
  public generateNewOrder(){
    this.showNewOrder.update(v => v=true);
  }

  public cancelNewOrder(){
    this.showNewOrder.update(v => v=false);
  }

  
}
