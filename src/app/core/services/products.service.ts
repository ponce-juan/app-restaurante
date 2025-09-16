import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environments';
import { HttpClient} from '@angular/common/http';
import { Product } from '../../interfaces/products';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = environment.baseUrl+environment.endpoints.products;
  private http = inject(HttpClient);
  private authService = inject(AuthService);


  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

}
