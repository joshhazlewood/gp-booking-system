import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

@Injectable()
export class StaffService {

  constructor(private http: HttpClient) { }

  public getDoctors() {
    return this.http.get("/api/staff/doctors");
  }

  public getStaff() {
    return this.http.get("/api/staff/all-staff");
  }

  public getStaffById(id) {
    return this.http.get(`/api/staff/staffMember/${id}`);
  }

  public saveStaffById(id, patient) {
    return this.http.patch(`/api/staff/staffMember/${id}`, patient);
  }

  public createStaff(data) {
    return this.http.post("/api/staff/new-staff", data);
  }

}
