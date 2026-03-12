import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardStats } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api';

  getStats() {
    return this.http.get<DashboardStats>(`${this.API}/dashboard`);
  }
}
