import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { interval } from 'rxjs/observable/interval';
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
      return this.http.post('/api/patients/login', { 'username': email, 'password': password });
    } else if (userType === 'staff') {
      this.userType = userType;
      return this.http.post('/api/staff/login', { 'username': email, 'password': password });
    }
  }

  tokenTest() {
    return this.http.get('/api/patients/all-patients');
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.router.navigateByUrl('/home');
  }

  public isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      setInterval(() => {
        const value = this.getExpiration() !== null && moment().isBefore(this.getExpiration());
        observer.next(value);
      }, 1000);
    });
  }

  public getLoggedInAsBool(): boolean {
    return this.getExpiration() !== null && moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    return expiration;
  }

  public getUser() {
    return this.user;
  }

  public setUser(user: User) {
    this.user = user;
  }

  public getUserDetails() {
    const user_id = this.getToken()['user_id'];
    return this.http.get(`/api/patients/user-data/${user_id}`);
  }

  public getToken() {
    const token = localStorage.getItem("id_token");
    const decodedToken = jwtDecode(token);
    const parsedToken = JSON.parse(decodedToken.data);
    return parsedToken;
  }

  getUserType() {
    const token = this.getToken();
    const user_role = token['user_role'];
    console.log(user_role);
    return user_role;
  }

  getUserId() {
    const user_id = this.getToken()['user_id'];
    return user_id;
  }

  // private getDetailsAndSetUser(user_id: string) {
  //   if (this.userType === 'patient') {
  //     const res = this.http.get(`/api/patients/user-data/${user_id}`)
  //       .subscribe(res => {
  //         const userData = res['data'];
  //         console.log(userData);
  //         this.user = {
  //           user_id: userData._id,
  //           user_name: userData.user_name,
  //           user_role: 'patient'
  //         };
  //         // return res;
  //         console.log(this.user);
  //       });
  //     // return res;
  //   } else if (this.userType === 'staff') {
  //     const res = this.http.get(`/api/staff/user-data/${user_id}`)
  //       .subscribe(res => {
  //         const userData = res['data'];
  //         console.log(userData);
  //         this.user = {
  //           user_id: userData._id,
  //           user_name: userData.user_name,
  //           user_role: userData.staff_role
  //         };
  //         // return res;
  //         console.log(this.user);
  //       });
  //   }
  // }
}
