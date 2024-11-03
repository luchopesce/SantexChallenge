import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;
  private authStatusSubject = new BehaviorSubject<boolean>(this.loggedIn);

  constructor() {
    const user = localStorage.getItem('user');
    this.loggedIn = !!user;
    this.authStatusSubject.next(this.loggedIn);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login() {
    this.loggedIn = true;
    localStorage.setItem('user', 'dummyUser');
    this.authStatusSubject.next(this.loggedIn);
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem('user');
    this.authStatusSubject.next(this.loggedIn);
  }

  getAuthStatus() {
    return this.authStatusSubject.asObservable();
  }
}
