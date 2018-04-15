import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Headers, RequestOptions } from "@angular/http";

import "rxjs/add/operator/map";

@Injectable()
export class DataService {

  public result: any;

  constructor(private http: HttpClient) { }

  public getUsers() {
    return this.http.get("/api/users").subscribe((result) => {
      this.result = result;
    });
  }

}
