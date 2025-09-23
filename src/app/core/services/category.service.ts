import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  private apiUrl = environment.baseUrl+environment.endpoints.categories;
  private http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

}
