import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private isBrowser = typeof window !== 'undefined';

  private _currentUser = new BehaviorSubject<string | null>(null);
  currentUser$ = this._currentUser.asObservable();


  login(username: string, password: string): boolean {
    // Simulate a login process
    if (username === 'admin' && password === 'admin') {
      if (this.isBrowser){
        localStorage.setItem('user', JSON.stringify(username));
        this.isAuthenticated = true;
        this._currentUser.next(username);
      }

      return true;
    }
    return false;
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
