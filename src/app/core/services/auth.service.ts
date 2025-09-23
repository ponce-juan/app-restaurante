import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environments';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../interfaces/login.request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser = typeof window !== 'undefined';
  private apiUrl = environment.baseUrl+environment.endpoints.login;
  private http = inject(HttpClient);
  private tokenKey = environment.tokenKeyLocalStorage;

  private _currentUser = new BehaviorSubject<string | null>(
    this.isBrowser ? localStorage.getItem(this.tokenKey) : null);
  currentUser$ = this._currentUser.asObservable();


  login(loginRequest: LoginRequest): Observable<{token: string}> {
    return this.http.post<{token:string}>(this.apiUrl, loginRequest).pipe(
      tap( response => {
        if(this.isBrowser){
          localStorage.setItem(this.tokenKey, response.token);
          this._currentUser.next(response.token);
        }
      })
    );

  }

  logout(): void {
    if(this.isBrowser){
      localStorage.removeItem(this.tokenKey);
      this._currentUser.next(null);
      
    }
  }

  isLoggedIn(): boolean {
    if (this.isBrowser ){
      return !!this.getToken();
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
      try{
        const cleanToken = token.split(" ")[1];
        const payload = cleanToken.split('.')[1];
        const decodedPayload = atob(payload);
        const parsedPayload = JSON.parse(decodedPayload);
        return parsedPayload.role || null;
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    }
    return null;
  }

  getCompanyId(): number {
    const token = this.getToken();
    if(token) {
      try {
        const cleanToken = token.split(" ")[1];
        const payload = cleanToken.split('.')[1];
        const decodedPayload = atob(payload);
        const parsedPayload = JSON.parse(decodedPayload);
        return parsedPayload.companyId || null;
      }catch (e) {
        console.error('Error decoding token:', e);
        return 0;
      }
    }
    return 0;
  }
  
}
