import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/register-request';
import { environment } from 'src/environments/environment';
import { UserResponse } from '../models/user-response';
import { DashboardStats } from '../models/dashboard-stats';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin`;

  getAllAgents(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.API_URL + '/agents');
  }

  getAgentsByAgency(agencyId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.API_URL}/agents/agency/${agencyId}`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/users/${userId}`);
  }

  registerAgent(data: RegisterRequest, agencyId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/register_agent?agencyId=${agencyId}`, data, { responseType: 'text' });
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/dashboard`);
  }

}
