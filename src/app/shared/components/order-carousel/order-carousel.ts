import {Component,inject,Input, signal,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStoreService } from '@core/services/order-store.service';
import { OrderCard } from '../order-card/order-card';

@Component({
  selector: 'app-order-carousel',
  standalone: true,
  imports: [CommonModule, OrderCard],
  templateUrl: './order-carousel.html',
  styleUrl: './order-carousel.css'
})
export class OrderCarousel{
  
  orderStore = inject(OrderStoreService);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(){
    this.orderStore.loadOrders().subscribe({
      next: (order) => {
        this.loading.set(false)
        this.error.set(null);
        // console.log("Ordenes cargadas: ", order)
      },
      error: (err) => {
        this.error.set('Error al cargar las ordenes: ' + err.message);
        this.loading.set(false);
      }
    });
  }

}
