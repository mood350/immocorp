import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService } from '../../core/services/admin';
import { Utilisateur } from '../../core/models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatChipsModule, MatSelectModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatTooltipModule, MatSlideToggleModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  utilisateurs = signal<Utilisateur[]>([]);
  stats = signal<any>(null);
  loading = signal(true);
  displayedColumns = ['nom', 'email', 'telephone', 'role', 'actif', 'actions'];
  roles = ['ADMIN', 'PROPRIETAIRE'];

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.adminService.getStats().subscribe(s => this.stats.set(s));
    this.adminService.getUtilisateurs().subscribe({
      next: (data) => { this.utilisateurs.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  toggleActif(user: Utilisateur) {
    this.adminService.toggleActif(user.id).subscribe({
      next: (updated) => {
        this.utilisateurs.update(list =>
          list.map(u => u.id === user.id ? updated : u)
        );
        this.snackBar.open(
          updated.actif ? 'Compte activé ✅' : 'Compte désactivé',
          'Fermer', { duration: 3000 }
        );
      },
      error: () => this.snackBar.open('Erreur ❌', 'Fermer', { duration: 3000 })
    });
  }

  changerRole(user: Utilisateur, role: string) {
    this.adminService.changerRole(user.id, role).subscribe({
      next: (updated) => {
        this.utilisateurs.update(list =>
          list.map(u => u.id === user.id ? updated : u)
        );
        this.snackBar.open('Rôle modifié ✅', 'Fermer', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erreur ❌', 'Fermer', { duration: 3000 })
    });
  }

  supprimer(user: Utilisateur) {
    if (!confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) return;
    this.adminService.supprimer(user.id).subscribe({
      next: () => {
        this.utilisateurs.update(list => list.filter(u => u.id !== user.id));
        this.snackBar.open('Utilisateur supprimé', 'Fermer', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erreur ❌', 'Fermer', { duration: 3000 })
    });
  }

}
