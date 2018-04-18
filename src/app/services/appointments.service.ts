import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

@Injectable()
export class AppointmentsService {

  public baseUrl = "/api/appointments";
  public confirmationData = null;

  constructor(private http: HttpClient) {
    this.confirmationData = {};
  }

  public getAppointments() {
    return this.http.get(this.baseUrl + "/all-appointments");
  }

  public getAppointmentsOnDate(date: Date) {
    return this.http.get(this.baseUrl + "/date/" + date.toISOString());
  }

  public createNewAppointment(appData) {
    return this.http.post(`${this.baseUrl}/new-appointment/`, appData);
  }

  public getDocsAppointments(doctorId) {
    return this.http.get(`${this.baseUrl}/app-as-event/${doctorId}`);
  }

  public getPatientsAppointments(patientId) {
    return this.http.get(`${this.baseUrl}/patient/${patientId}`);
  }

}
