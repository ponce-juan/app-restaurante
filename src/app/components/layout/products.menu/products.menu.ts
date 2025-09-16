import { Component, inject, OnInit } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Product } from '../../../interfaces/products';
import { ProductsService } from '../../../core/services/products.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-products.menu',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './products.menu.html',
  styleUrl: './products.menu.css'
})
export class ProductsMenu implements OnInit{

  public productList!: Observable<Product[]>;
  public errorMsg: string = "";
  public loading: boolean = false;
  private productsService: ProductsService = inject(ProductsService);

  ngOnInit(): void {
    this.loadProducts();

  }

  loadProducts(): void {
    this.loading = true;
    this.productList = this.productsService.getProducts().pipe(
      catchError ((error:string) => {
        this.errorMsg = error;
        return EMPTY;
      })
    );
    this.productList.forEach(
      p => console.log(p)
    )
  }
  
}
