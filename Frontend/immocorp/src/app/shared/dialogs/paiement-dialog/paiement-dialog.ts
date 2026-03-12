import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-paiement-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule
  ],
  templateUrl: './paiement-dialog.html',
})
export class PaiementDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PaiementDialogComponent>);
  data: { bailId: number } = inject(MAT_DIALOG_DATA);

  moyens = ['ESPECES', 'VIREMENT', 'MOBILE_MONEY', 'CHEQUE'];

  form = this.fb.group({
    bailId:            [this.data.bailId,  Validators.required],
    datePaiement:      ['',                Validators.required],
    montant:           [null,              Validators.required],
    moisConcerne:      ['',                Validators.required],
    moyenPaiement:     ['',                Validators.required],
    referencePaiement: [''],
  });

  submit() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
  cancel() { this.dialogRef.close(); }
}
