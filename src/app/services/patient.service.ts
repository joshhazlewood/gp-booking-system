import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class PatientService {

  private baseUrl = '/api/patients';
  public patient_idToFind: string = null;

  constructor(private http: HttpClient) { }

  getPatients() {
    return this.http.get(this.baseUrl + '/all-patients');
  }

  getPatientNotes(_id: string) {
    return this.http.get(`${this.baseUrl}/patient-notes/${_id}`);
  }

  //  FINISH SAVING NOTES
  savePatientNotes(_id: string, notes) {
    return this.http.post(`${this.baseUrl}/patient-notes/${_id}`, notes);
  }

  getPatientById(_id) {
    return this.http.get(`${this.baseUrl}/patient/${_id}`);
  }

  savePatientById(_id, data) {
    return this.http.patch(`${this.baseUrl}/patient/${_id}`, data);
  }

  createPatient(data) {
    return this.http.post(`${this.baseUrl}/new-patient`, data);
  }

}
