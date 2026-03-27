import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CounterResponse } from '../models/counter-response';
import { environment } from 'src/environments/environment';

export interface CounterRequest {
  number: number;
  agencyId: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/counters`;
  private readonly AGENT_URL = `${environment.apiUrl}/agent`;

  getCounterById(id: number): Observable<CounterResponse> {
    return this.http.get<CounterResponse>(`${this.API_URL}/${id}`);
  }

  getCountersByAgency(agencyId: number): Observable<CounterResponse[]> {
    return this.http.get<CounterResponse[]>(`${this.API_URL}/agency/${agencyId}`);
  }

  createCounter(data: CounterRequest): Observable<CounterResponse> {
    return this.http.post<CounterResponse>(this.API_URL, data);
  }

  updateCounter(id: number, data: CounterRequest): Observable<CounterResponse> {
    return this.http.put<CounterResponse>(`${this.API_URL}/${id}`, data);
  }

  toggleCounter(id: number): Observable<CounterResponse> {
    return this.http.patch<CounterResponse>(`${this.API_URL}/toggle/${id}`, {});
  }

  deleteCounter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  openCounter(counterId: number, agentId: number): Observable<CounterResponse> {
    return this.http.post<CounterResponse>(
      `${this.AGENT_URL}/open/${counterId}?agentId=${agentId}`, {}
    );
  }

  closeCounter(counterId: number): Observable<CounterResponse> {
    return this.http.post<CounterResponse>(
      `${this.AGENT_URL}/close/${counterId}`, {}
    );
  }

  heartbeat(counterId: number): Observable<void> {
  return this.http.post<void>(`${this.AGENT_URL}/heartbeat/${counterId}`, {});
}
}