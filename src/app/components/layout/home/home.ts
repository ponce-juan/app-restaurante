import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly title = 'Welcome to the Restaurant App';
  
  constructor() {
    console.log("Home component loaded");
  }
}
