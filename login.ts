import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSignIn(): void {
    const email = this.email.trim();
    const isEmailValid = email === 'admin@gmail.com';
    const isPasswordValid = this.password === 'Admin@1997';

    if (!isEmailValid && !isPasswordValid) {
      this.errorMessage = 'Both email and password are invalid';
    } else if (!isEmailValid) {
      this.errorMessage = 'Invalid email or username';
    } else if (!isPasswordValid) {
      this.errorMessage = 'Invalid password';
    } else {
      this.errorMessage = '';
      sessionStorage.setItem('token', 'dummy-token');
      this.router.navigate(['/errors']);
    }
  }

  onSignUp(): void {
    console.log('Sign up button clicked');
  }
}

