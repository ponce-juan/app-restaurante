import { Component, inject, OnInit, signal } from '@angular/core';
import { Orders } from '@components/orders/orders';
import { ProductService } from '@core/services/product.service';
import { Product } from '@models/products.model';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [Orders],
  templateUrl: './orders-management.html',
  styleUrl: './orders-management.css'
})
export class OrdersManagement implements OnInit{

  productService = inject(ProductService);
  showNewOrder = signal<boolean>(false);
  loading = signal<boolean>(true);
  errormsg = signal<string | null>(null);
  
  ngOnInit(){
    this._loadProducts()
  }

  private _loadProducts() {
    this.productService.loadProducts()
  }
  

  public generateNewOrder(){
    this.showNewOrder.update(v => v=true);
  }

  public cancelNewOrder(){
    this.showNewOrder.update(v => v=false);
  }

  
}
