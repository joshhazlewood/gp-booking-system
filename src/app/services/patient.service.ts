import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class PatientService {

  private baseUrl = '/api/patients';

  constructor(private http: HttpClient) { }

  getPatients() {
    return this.http.get(this.baseUrl + '/all-patients');
  }

}