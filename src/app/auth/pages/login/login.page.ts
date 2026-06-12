import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent]
})
export class LoginPage {
  email = 'tutor@example.com';
  password = 'Demo_Tutor123!';

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Ingrese correo y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
    });
  }
}