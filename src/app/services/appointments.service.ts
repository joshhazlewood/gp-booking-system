import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from "rxjs/Observable";
import { Appointment } from '../models/appointment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppointmentsService {

  result: any;

  constructor(private http: HttpClient) { }

  getAppointments() {
    return this.http
      .get('/api/appointments');
  }

  getAppointmentsOnDate(date: Date) {
    console.log('date: ' + date.toISOString());
    console.log('/api/appointments/date/' + date.toISOString());
    return this.http.get('/api/appointments/date/' + date.toISOString());
  }

}
