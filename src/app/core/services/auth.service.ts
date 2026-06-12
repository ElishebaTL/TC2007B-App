import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  foto_url: string | null;
}

export interface LoginResponse {
  status: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'grade_tracker_token';
  private readonly userKey = 'grade_tracker_user';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      {
        email,
        password
      }
    ).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.data.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  getUserFullName(): string {
    const user = this.getUser();

    if (!user) {
      return 'Padre de familia';
    }

    return `${user.nombre} ${user.apellido}`;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}