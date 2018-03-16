import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { tap } from 'rxjs/operators/tap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';
import * as jwtDecode from 'jwt-decode';

import { User } from './interfaces/user';

@Injectable()
export class AuthService {

  private user: User;
  private userType: string;

  constructor(private http: HttpClient,
    private router: Router) {
  }

  login(email: string, password: string, userType: string) {
    if (userType === 'patient') {
      this.userType = userType;
      return this.http.post('/api/patients/login', { "username": email, "password": password });
    } else if (userType === 'staff') {
      this.userType = userType;
      return this.http.post('/api/staff/login', { "username": email, "password": password });
    }
  }

  tokenTest() {
    return this.http.get('/api/patients/all-patients');
  }

  public setSession(authResult) {
    const expiresAt = moment()
      .add(authResult.expires_in, 's')
      .format('YYYY-MM-DD HH:mm:ss');
    let decodedToken = jwtDecode(authResult.id_token);
    const parsedToken = JSON.parse(decodedToken.data);
    const user_id = parsedToken.user_id;
    // this.user = 
    // this.user = {
    //   user_id: parsedToken.user_id,
    //   user_name: parsedToken.user_name,
    //   user_role: parsedToken.user_role
    // }

    localStorage.setItem('id_token', authResult.id_token);
    localStorage.setItem("expires_at", expiresAt);
    console.log(this.getUserDetails(user_id));
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.router.navigateByUrl('/home');
  }

  public isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      setInterval(() => {
        const value = this.getExpiration() !== null && moment().isBefore(this.getExpiration());
        observer.next(value);
      }, 1000)
    })
  }

  public getLoggedInAsBool(): boolean {
    return this.getExpiration() !== null && moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    return expiration;
  }

  public getUser() {
    return this.user;
  }

  private getUserDetails(user_id: string) {
    if (this.userType === 'patient') {
      const res = this.http.get(`/api/patients/user-data/${user_id}`)
        .subscribe(res => {
          console.log(res['data']); 
          return res;
        });
        return res;
      // return this.http.post('/api/patients/login', { "username": email, "password": password });
    } else if (this.userType === 'staff') {
      // return this.http.post('/api/staff/login', { "username": email, "password": password });
      console.log('usertype');
    }



    // return {
    //     user_id: parsedToken.user_id,
    //     user_name: parsedToken.user_name,
    //     user_role: parsedToken.user_role
    //   }
  }
}
