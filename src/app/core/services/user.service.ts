import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.baseUrl;
  private http = inject(HttpClient);
  
  
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}${environment.endpoints.users}`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${environment.endpoints.users}/${id}`);
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${environment.endpoints.users}/${username}`);
  }


  
}
