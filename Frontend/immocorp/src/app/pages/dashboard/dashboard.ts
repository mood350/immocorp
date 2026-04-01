import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../core/services/dashboard';
import { DashboardStats } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);

  cards = [
    { key: 'totalProprietes', label: 'Propriétés',     icon: 'home',         color: '#1B4F72', route: '/proprietes' },
    { key: 'totalLocataires', label: 'Locataires',     icon: 'people',       color: '#27AE60', route: '/locataires' },
    { key: 'bauxActifs',      label: 'Baux actifs',    icon: 'description',  color: '#8E44AD', route: '/baux'       },
    { key: 'alertesNonLues',  label: 'Alertes',        icon: 'notifications',color: '#E74C3C', route: '/alertes'    },
  ];

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getStatValue(key: string): number {
    const s = this.stats();
    if (!s) return 0;
    return (s as any)[key] ?? 0;
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  }
}
