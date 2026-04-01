import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Alerte } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AlerteService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/alertes';

  getAll()           { return this.http.get<Alerte[]>(this.API); }
  getNonLues()       { return this.http.get<Alerte[]>(`${this.API}/non-lues`); }
  getCount()         { return this.http.get<{count: number}>(`${this.API}/non-lues/count`); }
  marquerLue(id: number) { return this.http.put<void>(`${this.API}/${id}/lire`, {}); }
}
