import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProprieteService } from '../../core/services/propriete';
import { Propriete } from '../../core/models/models';
import { ProprieteDialogComponent } from '../../shared/dialogs/propriete-dialog/propriete-dialog';

@Component({
  selector: 'app-proprietes',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatChipsModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './proprietes.html',
  styleUrl: './proprietes.scss'
})
export class ProprietesComponent implements OnInit {
  private proprieteService = inject(ProprieteService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  proprietes = signal<Propriete[]>([]);
  loading = signal(true);
  displayedColumns = ['type', 'adresse', 'ville', 'superficie', 'loyer', 'statut', 'actions'];

  ngOnInit() { this.loadProprietes(); }

  loadProprietes() {
    this.loading.set(true);
    this.proprieteService.getAll().subscribe({
      next: (data) => { this.proprietes.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openDialog(propriete?: Propriete) {
    const ref = this.dialog.open(ProprieteDialogComponent, {
      width: '500px',
      data: propriete ?? null
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const op = propriete?.id
        ? this.proprieteService.update(propriete.id, result)
        : this.proprieteService.create(result);
      op.subscribe({
        next: () => {
          this.snackBar.open(
            propriete ? 'Propriété modifiée ✅' : 'Propriété ajoutée ✅',
            'Fermer', { duration: 3000 }
          );
          this.loadProprietes();
        },
        error: () => this.snackBar.open('Erreur ❌', 'Fermer', { duration: 3000 })
      });
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer cette propriété ?')) return;
    this.proprieteService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Propriété supprimée', 'Fermer', { duration: 3000 });
        this.loadProprietes();
      },
      error: () => this.snackBar.open('Erreur ❌', 'Fermer', { duration: 3000 })
    });
  }

  formatLoyer(loyer: number): string {
    return new Intl.NumberFormat('fr-FR').format(loyer) + ' FCFA';
  }
}
