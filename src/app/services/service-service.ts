import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceResponse } from '../models/service-response';
import { ServiceRequest } from '../models/service-request';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/services`;

  getAllServices(): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(this.API_URL);
  }

  getServiceById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.API_URL}/${id}`);
  }

  getServicesByAgency(agencyId: number): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(`${this.API_URL}/agency/${agencyId}`);
  }

  createService(data: ServiceRequest): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(this.API_URL, data);
  }

  deleteService(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.API_URL}/${id}`);
  }
}