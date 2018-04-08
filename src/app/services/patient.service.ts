import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class PatientService {

  public patient_idToFind: string = null;
  private baseUrl = "/api/patients";

  constructor(private http: HttpClient) { }

  getPatients() {
    return this.http.get(this.baseUrl + '/all-patients');
  }

  getPatientNotes(_id: string, staffId: string) {
    return this.http.get(`${this.baseUrl}/patient-notes/${_id}/${staffId}`);
  }

  //  FINISH SAVING NOTES
  savePatientNotes(_id: string, staffId: string, notes) {
    return this.http.post(`${this.baseUrl}/patient-notes/${_id}/${staffId}`, notes);
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
