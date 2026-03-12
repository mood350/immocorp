import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/admin';

  getUtilisateurs()              { return this.http.get<Utilisateur[]>(`${this.API}/utilisateurs`); }
  toggleActif(id: number)        { return this.http.put<Utilisateur>(`${this.API}/utilisateurs/${id}/toggle-actif`, {}); }
  changerRole(id: number, role: string) { return this.http.put<Utilisateur>(`${this.API}/utilisateurs/${id}/role`, { role }); }
  supprimer(id: number)          { return this.http.delete<void>(`${this.API}/utilisateurs/${id}`); }
  getStats()                     { return this.http.get<any>(`${this.API}/stats`); }
}
