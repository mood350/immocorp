import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Propriete } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProprieteService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/proprietes';

  getAll()             { return this.http.get<Propriete[]>(this.API); }
  create(p: Propriete) { return this.http.post<Propriete>(this.API, p); }
  update(id: number, p: Propriete) { return this.http.put<Propriete>(`${this.API}/${id}`, p); }
  delete(id: number)   { return this.http.delete<void>(`${this.API}/${id}`); }
}
