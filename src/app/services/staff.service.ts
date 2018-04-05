import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StaffService {

  constructor(private http: HttpClient) { }

  getDoctors() {
    return this.http.get('/api/staff/doctors');
  }

  getStaff() {
    return this.http.get('/api/staff/all-staff');
  }

  getStaffById(_id) {
    return this.http.get(`/api/staff/staffMember/${_id}`);
  }

}
