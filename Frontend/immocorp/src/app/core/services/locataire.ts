import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Locataire } from '../models/models';

@Injectable({ providedIn: 'root' })
export class LocataireService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/locataires';

  getAll()              { return this.http.get<Locataire[]>(this.API); }
  create(l: Locataire)  { return this.http.post<Locataire>(this.API, l); }
  update(id: number, l: Locataire) { return this.http.put<Locataire>(`${this.API}/${id}`, l); }
  delete(id: number)    { return this.http.delete<void>(`${this.API}/${id}`); }
}
