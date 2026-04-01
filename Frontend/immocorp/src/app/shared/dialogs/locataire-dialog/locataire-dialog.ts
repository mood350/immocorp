import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Locataire } from '../../../core/models/models';

@Component({
  selector: 'app-locataire-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './locataire-dialog.html',
})
export class LocataireDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<LocataireDialogComponent>);
  data: Locataire = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    nom:           [this.data?.nom ?? '',           Validators.required],
    prenom:        [this.data?.prenom ?? '',         Validators.required],
    telephone:     [this.data?.telephone ?? '',      Validators.required],
    email:         [this.data?.email ?? '',          [Validators.required, Validators.email]],
    pieceIdentite: [this.data?.pieceIdentite ?? '',  Validators.required],
    dateEntree:    [this.data?.dateEntree ?? '',      Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
  cancel() { this.dialogRef.close(); }
}
