import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppointmentsService {

  constructor(private http: HttpClient) { }

  getAppointments() {
    return this.http.get('/api/appointments');
  }

  getAppointmentsOnDate(date: Date) {
    return this.http.get('/api/appointments/date/' + date.toISOString());
  }

}
