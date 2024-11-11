import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

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
          if (response && response.token) {
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
    this.router.navigate(['/home']);
  }

  private hasToken(): boolean {
    return this.getToken() !== null;
  }
}
