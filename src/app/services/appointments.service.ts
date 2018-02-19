import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class AppointmentsService {

  baseUrl: string = '/api/appointments';
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  }

  getAppointments() {
    return this.http.get(this.baseUrl);
  }

  getAppointmentsOnDate(date: Date) {
    return this.http.get(this.baseUrl + '/date/' + date.toISOString());
  }

  createNewAppointment(appData) {
    console.log('appdata = ');
    console.log(appData);
    return this.http.post("/api/appointments" , appData, this.httpOptions);
  }

}
