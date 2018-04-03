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

  getPatientNotes(patient_id: string) {
    return this.http.get(`${this.baseUrl}/patient-notes/${patient_id}`);
  }
  
  //  FINISH SAVING NOTES
  savePatientNotes(patient_id: string, notes) {
    return this.http.post(`${this.baseUrl}/patient-notes/${patient_id}`, notes);
  }

}
