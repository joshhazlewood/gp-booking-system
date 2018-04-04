import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class AppointmentsService {

  baseUrl = '/api/appointments';
  confirmationData = null;

  constructor(private http: HttpClient) {
    this.confirmationData = {};
  }

  getAppointments() {
    return this.http.get(this.baseUrl + '/all-appointments');
  }

  getAppointmentsOnDate(date: Date) {
    return this.http.get(this.baseUrl + '/date/' + date.toISOString());
  }

  createNewAppointment(appData) {
    return this.http.post(`${this.baseUrl}/new-appointment/`, appData);
  }

  getDocsAppointments(doctor_id) {
    return this.http.get(this.baseUrl + '/app-as-event/' + doctor_id);
  }

}
