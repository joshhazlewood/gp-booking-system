import { Injectable } from '@angular/core';

@Injectable()
export class PatientService {

  private baseUrl: string = '/api/appointments';

  constructor(private http: HttpClient) { }

  getPatients() {
    return this.http.get(this.baseUrl + '/all-patients');
  }

}
