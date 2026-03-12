import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ProprieteService } from '../../../core/services/propriete';
import { LocataireService } from '../../../core/services/locataire';
import { Bail, Propriete, Locataire } from '../../../core/models/models';

@Component({
  selector: 'app-bail-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule
  ],
  templateUrl: './bail-dialog.html',
})
export class BailDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<BailDialogComponent>);
  private proprieteService = inject(ProprieteService);
  private locataireService = inject(LocataireService);
  data: Bail = inject(MAT_DIALOG_DATA);

  proprietes = signal<Propriete[]>([]);
  locataires = signal<Locataire[]>([]);

  form = this.fb.group({
    proprieteId:   [this.data?.proprieteId ?? null,  Validators.required],
    locataireId:   [this.data?.locataireId ?? null,  Validators.required],
    dateDebut:     [this.data?.dateDebut ?? '',       Validators.required],
    dateFin:       [this.data?.dateFin ?? ''],
    montantLoyer:  [this.data?.montantLoyer ?? null,  Validators.required],
    jourEcheance:  [this.data?.jourEcheance ?? null,  [Validators.required, Validators.min(1), Validators.max(31)]],
  });

  ngOnInit() {
    this.proprieteService.getAll().subscribe(data => this.proprietes.set(data));
    this.locataireService.getAll().subscribe(data => this.locataires.set(data));
  }

  submit() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
  cancel() { this.dialogRef.close(); }
}
