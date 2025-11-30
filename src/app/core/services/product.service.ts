import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environment/environments';
import { HttpClient} from '@angular/common/http';
import { Product } from '@models/products.model';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.baseUrl+environment.endpoints.products;
  private _http = inject(HttpClient);
  private _products = signal<Product[]>([]);
  public products = computed(() => this._products());

  //Cargo los productos desde la base de datos
  loadProducts(): Observable<Product[]>{
    return this.getProducts().pipe(
      tap(p => this._products.set(p))
    )
  }

  getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(this.apiUrl);
  }
  getProductById(id: number): Observable<Product>{
    return this._http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this._http.post<Product>(this.apiUrl, product);
  }

  updateProduct(prodId: number, newProduct: Product): Observable<Product>{
    return this._http.put<Product>(`${this.apiUrl}/${prodId}`, newProduct);
  }

  deleteProduct(prodId: number){
    return this._http.delete(`${this.apiUrl}/${prodId}`);
  }

}
