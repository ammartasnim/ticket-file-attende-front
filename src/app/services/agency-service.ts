import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgencyResponse } from '../models/agency-response';
import { AgencyRequest } from '../models/agency-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgencyService {
  private readonly http= inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/agencies`;


  getAllAgencies(): Observable<AgencyResponse[]> {
    return this.http.get<AgencyResponse[]>(this.API_URL);
  }

  getAgencyByCity(city: string): Observable<AgencyResponse[]> {
    return this.http.get<AgencyResponse[]>(`${this.API_URL}/city/${city}`);
  }

  getAgencyById(id: number): Observable<AgencyResponse> {
    return this.http.get<AgencyResponse>(`${this.API_URL}/${id}`);
  }

  createAgency(data: AgencyRequest): Observable<AgencyResponse> {
    return this.http.post<AgencyResponse>(this.API_URL, data, { responseType: 'json' });
  }

  updateAgency(agencyId: number, data: AgencyRequest): Observable<AgencyResponse> {
    return this.http.put<AgencyResponse>(`${this.API_URL}/${agencyId}`, data, { responseType: 'json' });
  }

  deleteAgency(agencyId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${agencyId}`);
  }

  toggleIsOpen(agencyId: number): Observable<AgencyResponse> {
    return this.http.patch<AgencyResponse>(`${this.API_URL}/toggle/${agencyId}`, {}, { responseType: 'json' });
  }

}
