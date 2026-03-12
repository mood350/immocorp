import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class QuittanceService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/paiements';

  downloadPdf(paiementId: number) {
    return this.http.get(`${this.API}/quittances/${paiementId}/pdf`, {
      responseType: 'blob'
    });
  }

  envoyerEmail(paiementId: number) {
    return this.http.post<void>(`${this.API}/quittances/${paiementId}/envoyer-email`, {});
  }
}
