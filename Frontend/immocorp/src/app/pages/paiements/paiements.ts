import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PaiementService } from '../../core/services/paiement';
import { QuittanceService } from '../../core/services/quittance';
import { BailService } from '../../core/services/bail';
import { Paiement, Bail } from '../../core/models/models';
import { PaiementDialogComponent } from '../../shared/dialogs/paiement-dialog/paiement-dialog';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatSelectModule, MatFormFieldModule, MatTooltipModule,
    MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './paiements.html',
  styleUrl: './paiements.scss'
})
export class PaiementsComponent implements OnInit {
  private paiementService = inject(PaiementService);
  private quittanceService = inject(QuittanceService);
  private bailService = inject(BailService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  baux = signal<Bail[]>([]);
  paiements = signal<Paiement[]>([]);
  selectedBailId = signal<number | null>(null);
  loading = signal(false);
  loadingPdf = signal<number | null>(null);
  loadingEmail = signal<number | null>(null);
  displayedColumns = ['mois', 'montant', 'moyen', 'reference', 'date', 'actions'];

  ngOnInit() {
    this.bailService.getAll().subscribe(data => this.baux.set(data));
  }

  onBailChange(bailId: number) {
    this.selectedBailId.set(bailId);
    this.loading.set(true);
    this.paiementService.getByBail(bailId).subscribe({
      next: (data) => { this.paiements.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openDialog() {
    if (!this.selectedBailId()) {
      this.snackBar.open('Sélectionnez un bail d\'abord', 'Fermer', { duration: 3000 });
      return;
    }
    const ref = this.dialog.open(PaiementDialogComponent, {
      width: '500px',
      data: { bailId: this.selectedBailId() }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.paiementService.create(result).subscribe({
        next: () => {
          this.snackBar.open('Paiement enregistré ✅', 'Fermer', { duration: 3000 });
          this.onBailChange(this.selectedBailId()!);
        },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Erreur ❌', 'Fermer', { duration: 4000 })
      });
    });
  }

  downloadPdf(paiement: Paiement) {
    this.loadingPdf.set(paiement.id!);
    this.quittanceService.downloadPdf(paiement.id!).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quittance-${paiement.moisConcerne}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.loadingPdf.set(null);
        this.snackBar.open('PDF téléchargé ✅', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.loadingPdf.set(null);
        this.snackBar.open('Erreur téléchargement ❌', 'Fermer', { duration: 3000 });
      }
    });
  }

  envoyerEmail(paiement: Paiement) {
    this.loadingEmail.set(paiement.id!);
    this.quittanceService.envoyerEmail(paiement.id!).subscribe({
      next: () => {
        this.loadingEmail.set(null);
        this.snackBar.open('Quittance envoyée par email ✅', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.loadingEmail.set(null);
        this.snackBar.open('Erreur envoi email ❌', 'Fermer', { duration: 3000 });
      }
    });
  }

  formatMontant(m: number): string {
    return new Intl.NumberFormat('fr-FR').format(m) + ' FCFA';
  }

  getBailLabel(bail: Bail): string {
    return `${bail.locataire?.prenom ?? ''} ${bail.locataire?.nom ?? ''} — ${bail.propriete?.adresse ?? ''}`;
  }
}
