import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocataireService } from '../../core/services/locataire';
import { Locataire } from '../../core/models/models';
import { LocataireDialogComponent } from '../../shared/dialogs/locataire-dialog/locataire-dialog';

@Component({
  selector: 'app-locataires',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './locataires.html',
  styleUrl: './locataires.scss'
})
export class LocatairesComponent implements OnInit {
  private locataireService = inject(LocataireService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  locataires = signal<Locataire[]>([]);
  loading = signal(true);
  displayedColumns = ['nom', 'telephone', 'email', 'pieceIdentite', 'dateEntree', 'actions'];

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.locataireService.getAll().subscribe({
      next: (data) => { this.locataires.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openDialog(locataire?: Locataire) {
    const ref = this.dialog.open(LocataireDialogComponent, {
      width: '500px',
      data: locataire ?? null
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const op = locataire?.id
        ? this.locataireService.update(locataire.id, result)
        : this.locataireService.create(result);
      op.subscribe({
        next: () => {
          this.snackBar.open(
            locataire ? 'Locataire modifié ✅' : 'Locataire ajouté ✅',
            'Fermer', { duration: 3000 }
          );
          this.load();
        },
        error: () => this.snackBar.open('Erreur ❌', 'Fermer', { duration: 3000 })
      });
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce locataire ?')) return;
    this.locataireService.delete(id).subscribe({
      next: () => { this.snackBar.open('Supprimé', 'Fermer', { duration: 3000 }); this.load(); },
      error: () => this.snackBar.open('Erreur ❌', 'Fermer', { duration: 3000 })
    });
  }
}
