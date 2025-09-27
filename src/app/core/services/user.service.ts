import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserDTO } from '../../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.baseUrl+environment.endpoints.users;
  private http = inject(HttpClient);
  
  
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${username}`);
  }

  //Retorna UserDto, recibe UserCreateDTO
  createUser(user: UserDTO): Observable<any>{
    return this.http.post<UserDTO>(this.apiUrl, user)
  }


  
}
