import { Component, signal } from '@angular/core';
import { Orders } from '@components/orders/orders';
import { Product } from '@models/products.model';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [Orders],
  templateUrl: './orders-management.html',
  styleUrl: './orders-management.css'
})
export class OrdersManagement {

  showNewOrder = signal<boolean>(false);
  public products = signal<Product[]>([]);
  

  public generateNewOrder(){
    this.showNewOrder.update(v => v=true);
  }

  public cancelNewOrder(){
    this.showNewOrder.update(v => v=false);
  }

  
}
