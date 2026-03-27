import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/services`;

  getAllServices(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  getServicesByAgency(agencyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/agency/${agencyId}`);
  }

  createService(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}