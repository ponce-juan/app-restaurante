import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environments';
import { HttpClient} from '@angular/common/http';
import { Product } from '../../interfaces/products';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = environment.baseUrl+environment.endpoints.products;
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(prodId: number, newProduct: Product): Observable<Product>{
    return this.http.put<Product>(`${this.apiUrl}/${prodId}`, newProduct);
  }

  deleteProduct(prodId: number){
    return this.http.delete(`${this.apiUrl}/${prodId}`);
  }

}
