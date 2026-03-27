import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TicketRequest } from '../models/ticket-request';
import { TicketResponse } from '../models/ticket-response';


@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/tickets`;

  getTicketById(id: number): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(`${this.API_URL}/${id}`);
  }

  generateTicket(data: TicketRequest): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(`${this.API_URL}/generate`, data);
  }

  getWaitingTickets(): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(this.API_URL);
  }

  getWaitingTicketsByAgency(agencyId: number): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(`${this.API_URL}/agency/${agencyId}`);
  }

  cancelTicket(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/cancel/${id}`, {});
  }

  expireTicket(id: number): Observable<TicketResponse> {
    return this.http.put<TicketResponse>(`${this.API_URL}/expire/${id}`, {});
  }

  treatTicket(id: number, pin: number): Observable<TicketResponse> {
    return this.http.put<TicketResponse>(`${this.API_URL}/treat/${id}?pin=${pin}`, {});
  }

  completeTicket(id: number): Observable<TicketResponse> {
    return this.http.put<TicketResponse>(`${this.API_URL}/complete/${id}`, {});
  }

  callNext(counterId: number): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(`${this.API_URL}/next/${counterId}`, {});
  }

  getQueuePosition(id: number): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/position/${id}`);
  }

  getWaitTime(id: number): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/waitTime/${id}`);
  }

  getEarliestTime(agencyId: number, serviceId: number, isTomorrow: boolean): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/earliest?agencyId=${agencyId}&serviceId=${serviceId}&tomorrow=${isTomorrow}`);
  }

  treatByUuid(uuid: string, counterId: number): Observable<TicketResponse> {
    return this.http.put<TicketResponse>(`${this.API_URL}/treat-by-uuid/${uuid}?counterId=${counterId}`, {});
  }

  getTicketHistory(clientId: number): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(`${this.API_URL}/client/${clientId}`);
  }
}