import { Component, signal } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { Nav } from './components/layout/nav/nav';
import { Footer } from './components/layout/footer/footer';
import { LoginSidebar } from "./components/layout/login-sidebar/login-sidebar";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer, LoginSidebar],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App {
  protected readonly title = signal('Restaurant App');
}
