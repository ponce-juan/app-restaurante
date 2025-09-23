import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subcategory } from '../../interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  private apiUrl = environment.baseUrl+environment.endpoints.subcategories;
  private http = inject(HttpClient);

  getSubcategories(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(this.apiUrl);
  }
  
}
