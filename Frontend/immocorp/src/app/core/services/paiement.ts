import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paiement } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PaiementService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/paiements';

  getByBail(bailId: number) { return this.http.get<Paiement[]>(`${this.API}/bail/${bailId}`); }
  create(p: Paiement)       { return this.http.post<Paiement>(this.API, p); }
  getPdf(id: number)        { return this.http.get(`${this.API}/quittances/${id}/pdf`, { responseType: 'blob' }); }
}
