import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

@Injectable()
export class PatientService {

  public patientIdToFind: string = null;
  private baseUrl = "/api/patients";

  constructor(private http: HttpClient) { }

  public getPatients() {
    return this.http.get(this.baseUrl + "/all-patients");
  }

  public getPatientNotes(id: string, staffId: string) {
    return this.http.get(`${this.baseUrl}/patient-notes/${id}`);
  }

  //  FINISH SAVING NOTES
  public savePatientNotes(id: string, staffId: string notes) {
    return this.http.post(`${this.baseUrl}/patient-notes/${id}/${staffId}`, notes);
  }

  public getPatientById(id) {
    return this.http.get(`${this.baseUrl}/patient/${id}`);
  }

  public savePatientById(id, data) {
    return this.http.patch(`${this.baseUrl}/patient/${id}`, data);
  }

  public createPatient(data) {
    return this.http.post(`${this.baseUrl}/new-patient`, data);
  }

}
