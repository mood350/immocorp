import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth';

const PAGES_SANS_NAVBAR = ['/login', '/register', '/accueil', '/'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    CommonModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  authService    = inject(AuthService);

  showNav = signal(false);
  isAdmin = computed(() => this.authService.isAdmin());

  userName = computed(() => {
    const u = this.authService.currentUser();
    if (!u) return '';
    return `${u.prenom ?? ''} ${u.nom ?? ''}`.trim();
  });

  userInitials = computed(() => {
    const u = this.authService.currentUser();
    if (!u) return '?';
    const p = u.prenom ?? '';
    const n = u.nom ?? '';
    return `${p.charAt(0)}${n.charAt(0)}`.toUpperCase() || '?';
  });

  constructor() {
    const urlInitiale = window.location.pathname.split('?')[0];
    this.showNav.set(!PAGES_SANS_NAVBAR.includes(urlInitiale));

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const url = e.urlAfterRedirects.split('?')[0];
      this.showNav.set(!PAGES_SANS_NAVBAR.includes(url));
    });
  }

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }
}
