import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavItem } from '../../../interfaces/navItem';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

  authService = inject(AuthService);
  router = inject(Router);
  
  protected navItems: NavItem[] = [
    { label: 'Admin', route: 'admin', roles: ['ADMIN'] },
    { label: 'Home', route: 'home', roles: ['ADMIN', 'SUPERVISOR', 'MOZO'] },
    { label: 'Menu', route: 'menu', roles: ['ADMIN', 'SUPERVISOR']},
    { label: 'Orders', route: 'tables', roles: ['ADMIN', 'SUPERVISOR', 'MOZO'] },
    // { label: 'Mesas', route: 'tables', roles: ['ADMIN', 'SUPERVISOR', 'MOZO'] },
  ]; 

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    console.log("Logged out");
  }
  printRoute(item: string){
    // console.log("Ruta: ", item);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  hasRole(roles: string[]): boolean {
    const role = this.authService.getRole();
    return role != null && roles.includes(role);
  }
  
}
