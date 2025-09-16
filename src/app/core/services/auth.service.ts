import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environments';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../interfaces/login.request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private isBrowser = typeof window !== 'undefined';
  private apiUrl = environment.baseUrl;
  private http = inject(HttpClient);
  private tokenKey = 'user';

  private _currentUser = new BehaviorSubject<string | null>(null);
  currentUser$ = this._currentUser.asObservable();



  login(loginRequest: LoginRequest): Observable<{token: string}> {

    const endpoint:string = `${this.apiUrl}${environment.endpoints.login}`;

    return this.http.post<{token:string}>(endpoint, loginRequest).pipe(
      tap( response => {
        if(this.isBrowser){
          localStorage.setItem(this.tokenKey, response.token);
          this.isAuthenticated = true;
          this._currentUser.next(response.token);
        }
      })
    );

  }

  logout(): void {
    if(this.isBrowser){
      localStorage.removeItem(this.tokenKey);
      this.isAuthenticated = false;
      this._currentUser.next(null);
      
    }
  }

  isLoggedIn(): boolean {
    if (this.isBrowser){
      const user = localStorage.getItem(this.tokenKey);
      return !!user;
    }
    return false;
  }

  getToken(): string | null {
    if (this.isBrowser){
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const cleanToken = token.split(" ")[1];
      const payload = cleanToken.split('.')[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);
      return parsedPayload.role || null;
    }
    return null;
  }
  
}
