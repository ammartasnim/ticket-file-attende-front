import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RegisterRequest } from '../models/register-request';
import { environment } from 'src/environments/environment';
import { UserResponse } from '../models/user-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly router = inject(Router);

  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(infos: LoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/login`, infos).pipe(
      tap(res => {
        if (res.token) localStorage.setItem('token', res.token);
        this.currentUserSubject.next(res);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data, { responseType: 'text' });
  }

  changePassword(data: any): Observable<void> {
  return this.http.post<void>(`${this.API_URL}/change-password`, data);
}

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/me`).pipe(
      tap(res => this.currentUserSubject.next(res))
    );
  }

  async logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser(): UserResponse | null {
    return this.currentUserSubject.getValue();
  }
}
