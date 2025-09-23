import { Component, Input } from '@angular/core';
import { Item, Order } from '../../interfaces/table';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [],
  templateUrl: './order-table.html',
  styleUrl: './order-table.css'
})
export class OrderTable {
  @Input() order!: Order;

  removeItem(item: Item){
    this.order.items.filter(i => i.name != item.name);
  }

  editItem(item: Item){
    
  }

}
