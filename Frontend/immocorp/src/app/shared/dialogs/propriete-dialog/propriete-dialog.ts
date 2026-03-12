import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Propriete } from '../../../core/models/models';

@Component({
  selector: 'app-propriete-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule
  ],
  templateUrl: './propriete-dialog.html',
})
export class ProprieteDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProprieteDialogComponent>);
  data: Propriete = inject(MAT_DIALOG_DATA);

  types = ['APPARTEMENT', 'MAISON', 'STUDIO', 'VILLA', 'BUREAU', 'MAGASIN'];

  form = this.fb.group({
    type:       [this.data?.type ?? '',      Validators.required],
    adresse:    [this.data?.adresse ?? '',   Validators.required],
    ville:      [this.data?.ville ?? '',     Validators.required],
    superficie: [this.data?.superficie ?? null, Validators.required],
    loyer:      [this.data?.loyer ?? null,   Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel() { this.dialogRef.close(); }
}
