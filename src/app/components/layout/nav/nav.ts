import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

  authService = inject(AuthService);

  logout() {
    this.authService.logout();
    console.log("Logged out");
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  


}
