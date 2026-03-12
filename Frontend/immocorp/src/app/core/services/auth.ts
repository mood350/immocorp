import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'PROPRIETAIRE';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http       = inject(HttpClient);
  private router     = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private readonly API       = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'immocorp_token';
  private readonly USER_KEY  = 'immocorp_user';

  isAuthenticated = signal<boolean>(this.isLoggedIn());
  currentUser     = signal<AuthResponse | null>(this.getUser());

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.API}/login`, { email, password }).pipe(
      tap(response => this.saveSession(response))
    );
  }

  register(data: any) {
    return this.http.post<AuthResponse>(`${this.API}/register`, data).pipe(
      tap(response => this.saveSession(response))
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthResponse | null {
    if (!this.isBrowser()) return null;
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  isProprietaire(): boolean {
    return this.currentUser()?.role === 'PROPRIETAIRE';
  }

  private saveSession(response: AuthResponse) {
    if (this.isBrowser()) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    }
    this.isAuthenticated.set(true);
    this.currentUser.set(response);
  }
}
