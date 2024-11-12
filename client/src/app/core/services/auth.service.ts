import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authStatus = new BehaviorSubject<boolean>(this.getToken() !== null);
  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, {
      username,
      password,
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          if (response?.token) {
            this.setToken(response.token);
          }
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.authStatus.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authStatus.next(false);
    this.router.navigate(['/players']);
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .post<boolean>(`${this.apiUrl}/auth/validate-token`, { token })
      .pipe(
        tap((isValid) => {
          if (!isValid) {
            this.logout();
          }
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }
}
