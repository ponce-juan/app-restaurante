import { Component, inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavItem } from '@models/nav.item.model';

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
    { label: 'Stock', route: 'stock', roles: ['ADMIN', 'SUPERVISOR']},
    { label: 'Ordenes', route: 'orders', roles: ['ADMIN', 'SUPERVISOR', 'MOZO'] },
    { label: 'Mesas', route: 'tables', roles: ['ADMIN', 'SUPERVISOR'] },
  ]; 

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    console.log("Logged out");
  }
  
  getRole(): string{
    return this.authService.getRole() || "";
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  hasRole(roles: string[]): boolean {
    const role = this.authService.getRole();
    return role != null && roles.includes(role);
  }
  
}
