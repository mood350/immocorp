import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bail } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BailService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/baux';

  getAll()           { return this.http.get<Bail[]>(this.API); }
  getById(id: number){ return this.http.get<Bail>(`${this.API}/${id}`); }
  create(b: Bail)    { return this.http.post<Bail>(this.API, b); }
  update(id: number, b: Bail) { return this.http.put<Bail>(`${this.API}/${id}`, b); }
  resilier(id: number){ return this.http.put<void>(`${this.API}/${id}/resilier`, {}); }
}
