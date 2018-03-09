import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { tap } from 'rxjs/operators/tap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from './interfaces/user';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthService {

  // private loggedIn: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    // this.loggedIn = new BehaviorSubject<boolean>(false);
  }

  login(email: string, password: string, userType: string) {
    if (userType === 'patient') {
      return this.http.post('/api/patients/login', { "username": email, "password": password })
        .pipe(
          tap((res) => this.setSession(res['data']))
        );
    } else if (userType === 'staff') {
      return this.http.post('/api/staff/login', { email, password });
    }
  }

  tokenTest() {
    return this.http.get('/api/patients/all-patients');
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expires_at, 'second');

    localStorage.setItem('id_token', authResult.id_token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      setInterval(() => {
        const value = this.getExpiration() !== null && moment().isBefore(this.getExpiration())
        console.log(`val: ${value}`);
        observer.next(value);
      }, 1000)
    })
  }

  isLoggedOut() {
    return !this.isLoggedIn();

  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
