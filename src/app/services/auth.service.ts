import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import * as jwtDecode from "jwt-decode";
import * as moment from "moment";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { interval } from "rxjs/observable/interval";
import { catchError } from "rxjs/operators";
import { tap } from "rxjs/operators/tap";
import { Observable } from "rxjs/Rx";

import { IUser as User } from "./interfaces/user";

@Injectable()
export class AuthService {

  private user: User;
  private userType: string;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  public login(email: string, password: string, userType: string) {
    if (userType === "patient") {
      this.userType = userType;
      return this.http.post("/api/patients/login", { username: email, password });
    } else if (userType === "staff") {
      this.userType = userType;
      return this.http.post("/api/staff/login", { username: email, password });
    }
  }

  public tokenTest() {
    return this.http.get("/api/patients/all-patients");
  }

  public logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.router.navigateByUrl("/home");
  }

  public isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      setInterval(() => {
        const value = this.getExpiration() !== null && moment().isBefore(this.getExpiration());
        observer.next(value);
      }, 1000);
    });
  }

  public getLoggedInAsBool(): boolean {
    return this.getExpiration() !== null && moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    return expiration;
  }

  public getUser() {
    return this.user;
  }

  public setUser(user: User) {
    this.user = user;
  }

  public getUserDetails() {
    const user_id = this.getToken().user_id;
    return this.http.get(`/api/patients/user-data/${user_id}`);
  }

  public getToken() {
    const token = localStorage.getItem("id_token");
    const decodedToken = jwtDecode(token);
    const parsedToken = JSON.parse(decodedToken.data);
    return parsedToken;
  }

  public getUserType() {
    const token = this.getToken();
    const user_role = token.user_role;
    return user_role;
  }

  public getUserId() {
    const user_id = this.getToken().user_id;
    return user_id;
  }

}
