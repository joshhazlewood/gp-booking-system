import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './interfaces/user';
// import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<User>('/api/login', { email, password })
      .map( user => {
        // if (user && user.token)
      })
  }
}
