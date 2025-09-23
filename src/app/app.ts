import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, Routes } from '@angular/router';
import { Nav } from './components/layout/nav/nav';
import { Footer } from './components/layout/footer/footer';
import { AuthService } from './core/services/auth.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit{
  protected readonly title = signal('Restaurant App');
  router = inject(Router);
  authService = inject(AuthService);

  ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/login']);
    }
  }
  
}
