import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { AlerteService } from '../../core/services/alerte';
import { Alerte } from '../../core/models/models';

type Filtre = 'TOUTES' | 'NON_LUES' | 'RETARD_PAIEMENT' | 'FIN_BAIL_PROCHE' | 'LOYER_IMPAYE' | 'ECHEANCE_BAIL';

@Component({
  selector: 'app-alertes',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule,
    MatCardModule, MatChipsModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatBadgeModule
  ],
  templateUrl: './alertes.html',
  styleUrl: './alertes.scss'
})
export class AlertesComponent implements OnInit {
  private alerteService = inject(AlerteService);
  private snackBar      = inject(MatSnackBar);

  alertes        = signal<Alerte[]>([]);
  loading        = signal(true);
  filtreActif    = signal<Filtre>('TOUTES');

  filtres: { key: Filtre; label: string; icon: string }[] = [
    { key: 'TOUTES',           label: 'Toutes',        icon: 'notifications'   },
    { key: 'NON_LUES',         label: 'Non lues',      icon: 'mark_email_unread' },
    { key: 'RETARD_PAIEMENT',  label: 'Retards',       icon: 'warning'         },
    { key: 'FIN_BAIL_PROCHE',  label: 'Fins de bail',  icon: 'schedule'        },
    { key: 'LOYER_IMPAYE',     label: 'Impayés',       icon: 'money_off'       },
    { key: 'ECHEANCE_BAIL',    label: 'Échéances',     icon: 'event'           },
  ];

  // ✅ Alertes filtrées réactivement
  alertesFiltrees = computed(() => {
    const filtre = this.filtreActif();
    const liste  = this.alertes();
    if (filtre === 'TOUTES')    return liste;
    if (filtre === 'NON_LUES')  return liste.filter(a => !a.estLue);
    return liste.filter(a => a.type === filtre);
  });

  nonLues = computed(() => this.alertes().filter(a => !a.estLue).length);

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.alerteService.getAll().subscribe({
      next: (data) => {
        // ✅ Trier : non lues en premier, puis par date décroissante
        const sorted = data.sort((a, b) => {
          if (a.estLue !== b.estLue) return a.estLue ? 1 : -1;
          return new Date(b.dateAlerte).getTime() - new Date(a.dateAlerte).getTime();
        });
        this.alertes.set(sorted);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Erreur de chargement', 'Fermer', { duration: 3000 });
      }
    });
  }

  setFiltre(filtre: Filtre) {
    this.filtreActif.set(filtre);
  }

  marquerLue(alerte: Alerte) {
    if (alerte.estLue) return;
    this.alerteService.marquerLue(alerte.id!).subscribe({
      next: () => {
        this.alertes.update(list =>
          list.map(a => a.id === alerte.id ? { ...a, estLue: true } : a)
        );
      },
      error: () => this.snackBar.open('Erreur ❌', 'Fermer', { duration: 3000 })
    });
  }

  marquerToutesLues() {
    const nonLues = this.alertes().filter(a => !a.estLue);
    if (nonLues.length === 0) return;
    nonLues.forEach(a => this.marquerLue(a));
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      RETARD_PAIEMENT: 'warning',
      FIN_BAIL_PROCHE: 'schedule',
      LOYER_IMPAYE:    'money_off',
      ECHEANCE_BAIL:   'event',
    };
    return icons[type] ?? 'notifications';
  }

  getColor(type: string): string {
    const colors: Record<string, string> = {
      RETARD_PAIEMENT: '#E74C3C',
      FIN_BAIL_PROCHE: '#F39C12',
      LOYER_IMPAYE:    '#C0392B',
      ECHEANCE_BAIL:   '#2E86C1',
    };
    return colors[type] ?? '#888';
  }

  getLabel(type: string): string {
    const labels: Record<string, string> = {
      RETARD_PAIEMENT: 'Retard de paiement',
      FIN_BAIL_PROCHE: 'Fin de bail proche',
      LOYER_IMPAYE:    'Loyer impayé',
      ECHEANCE_BAIL:   'Échéance bail',
    };
    return labels[type] ?? type;
  }

  compterParFiltre(filtre: Filtre): number {
    const liste = this.alertes();
    if (filtre === 'TOUTES')   return liste.length;
    if (filtre === 'NON_LUES') return liste.filter(a => !a.estLue).length;
    return liste.filter(a => a.type === filtre).length;
  }
}
