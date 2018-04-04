import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result: any;

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('/api/users').subscribe(result => {
      this.result = result;
    });
  }

}
