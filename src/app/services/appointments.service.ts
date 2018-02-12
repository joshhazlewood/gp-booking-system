import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

// import { Appointment } from '../services/interfaces/appointment'

import {Observable} from "rxjs/Observable";
import { Appointment } from '../models/appointment';

@Injectable()
export class AppointmentsService {

  result: any;

  constructor(private http: Http) { }

  getAppointments(): Observable<Appointment[]> {
    return this.http
      .get('/api/appointments')
      .map((res: Response) => {
        // return <Appointment[]> res.json();
        return res.json().results().map(app => {
          return new Appointment(
            app.appointment_id,
            app.
          )
        });
      })
  }

}
