import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  public user:  string = "";
  public password: string = "";
  authService = inject(AuthService);
  router = inject(Router);
  
  onLogin() {
    if(this.authService.login(this.user, this.password)) {
      console.log("Login successful");
      this.router.navigate(['/home']);
    }else{
      console.log("Login failed");
      alert("Invalid username or password");
      this.user = "";
      this.password = "";
    }
  }

}
