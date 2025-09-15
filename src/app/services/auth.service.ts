import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environment/environments';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../model/login.request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private isBrowser = typeof window !== 'undefined';
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private _currentUser = new BehaviorSubject<string | null>(null);
  currentUser$ = this._currentUser.asObservable();



  login(loginRequest: LoginRequest): Observable<{token: string}> {

    const endpoint:string = `${this.apiUrl}${environment.endpoints.login}`;

    return this.http.post<{token:string}>(endpoint, loginRequest).pipe(
      tap( response => {
        if(this.isBrowser){
          localStorage.setItem('user', response.token);
          this.isAuthenticated = true;
          this._currentUser.next(response.token);
        }
      })
    );

  }

  logout(): void {
    if(this.isBrowser){
      localStorage.removeItem('user');
      this.isAuthenticated = false;
      this._currentUser.next(null);
    }
  }

  isLoggedIn(): boolean {
    if (this.isBrowser){
      const user = localStorage.getItem('user');
      return !!user;
    }
    return false;
  }
  
}
