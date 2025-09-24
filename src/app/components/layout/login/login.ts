import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../interfaces/login.request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginRequest: LoginRequest = {
                                  username: '',
                                  password: ''
                                };
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage: string | null = null;
  
  onLogin() {
    this.authService.login(this.loginRequest).subscribe(
      {
        next: (data) => {
          // console.log("Login successful");   
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error("Login failed", error.message);
          this.errorMessage="Invalid username or password";
          this.loginRequest.username = "";
          this.loginRequest.password = "";
        }
      }
    );
  }

}
