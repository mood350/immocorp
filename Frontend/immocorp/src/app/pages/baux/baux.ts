import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BailService } from '../../core/services/bail';
import { Bail } from '../../core/models/models';
import { BailDialogComponent } from '../../shared/dialogs/bail-dialog/bail-dialog';

@Component({
  selector: 'app-baux',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './baux.html',
  styleUrl: './baux.scss'
})
export class BauxComponent implements OnInit {
  private bailService = inject(BailService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  baux = signal<Bail[]>([]);
  loading = signal(true);
  displayedColumns = ['locataire', 'propriete', 'loyer', 'echeance', 'dateDebut', 'dateFin', 'statut', 'actions'];

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.bailService.getAll().subscribe({
      next: (data) => { this.baux.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openDialog(bail?: Bail) {
    const ref = this.dialog.open(BailDialogComponent, {
      width: '560px',
      data: bail ?? null
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const op = bail?.id
        ? this.bailService.update(bail.id, result)
        : this.bailService.create(result);
      op.subscribe({
        next: () => {
          this.snackBar.open(bail ? 'Bail modifié ✅' : 'Bail créé ✅', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Erreur ❌', 'Fermer', { duration: 4000 })
      });
    });
  }

  resilier(id: number) {
    if (!confirm('Résilier ce bail ?')) return;
    this.bailService.resilier(id).subscribe({
      next: () => { this.snackBar.open('Bail résilié', 'Fermer', { duration: 3000 }); this.load(); },
      error: () => this.snackBar.open('Erreur ❌', 'Fermer', { duration: 3000 })
    });
  }

  formatLoyer(loyer: number): string {
    return new Intl.NumberFormat('fr-FR').format(loyer) + ' FCFA';
  }
}
