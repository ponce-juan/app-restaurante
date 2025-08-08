import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../services/sidebar.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-sidebar.html',
  styleUrl: './login-sidebar.css'
})
export class LoginSidebar {

  public user:  string = "";
  public password: string = "";
  
  constructor(public sidebarService: SidebarService) {
    console.log("LoginSidebar component loaded");
  }

  onLogin() {

    console.log("Login: ", this.user, this.password);

    this.sidebarService.close();
  }
}
