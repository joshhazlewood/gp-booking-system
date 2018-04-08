import { Component, OnInit } from '@angular/core';

import { AuthService } from "../services/auth.service";
import { PatientService } from "../services/patient.service";
import { AppointmentsService } from "../services/appointments.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PatientProfile } from "../models/patient-profile";
import { Address } from "../models/address";

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {

  private userId: string = null;
  public messages: string[] = null;
  public user: PatientProfile = null;
  public userFound: boolean = null;
  public appointmentsFound: boolean = null;
  public hasNoAppointments: boolean = null;
  public appointments: any[];

  constructor(private patientService: PatientService, private authService: AuthService, private spinnerService: Ng4LoadingSpinnerService,
    private appointmentsService: AppointmentsService) { }

  ngOnInit() {
    this.userFound = false;
    this.appointmentsFound = false;
    this.spinnerService.show();
    this.messages = [];
    this.userId = this.authService.getUserId();
    console.log(this.userId);
    this.getPatientData();
    this.getAppointmentsData();
  }

  getPatientData() {
    this.patientService.getPatientById(this.userId).subscribe(
      (response) => {
        const status: number = response['status'];
        if (status === 200) {
          const data = response['data'];
          const rawAddress = data['address'];

          let address: Address = {
            line1: rawAddress.line1,
            line2: rawAddress.line2,
            town_city: rawAddress.town_city,
            postcode: rawAddress.postcode,
          };
          this.user = {
            _id: data._id,
            patient_id: data.patient_id,
            forename: data.forename,
            surname: data.surname,
            username: data.user_name,
            address: address,
          }
          this.userFound = true;
          this.spinnerService.hide();
        } else if (status.toString().startsWith("4")) {
          this.hasNoAppointments = true;
          this.appointmentsFound = true;
          this.spinnerService.hide();
        } else if (status === 500) {
          const msg = "Error getting user appointment data. Please refresh the page.";
          this.spinnerService.hide();
          this.pushMsgAndRemoveAfterInterval(msg);
        }
      },
      (err) => {
        const msg = "Error getting user profile data. Please refresh the page.";
        this.pushMsgAndRemoveAfterInterval(msg);
        this.spinnerService.hide();
      }
    );
  }

  getAppointmentsData() {
    this.spinnerService.show();
    console.log('getting apps');
    this.appointmentsService.getPatientsAppointments(this.userId).subscribe(
      (response) => {
        console.log(response);
        const status: number = response['status'];
        if (status === 200) {
          const data = response['data'];
          this.appointments = data;
          this.appointmentsFound = true;
          this.spinnerService.hide();
        } else if (status.toString().startsWith("4")) {
          const msg = "Error getting user profile data. Please refresh the page.";
          this.pushMsgAndRemoveAfterInterval(msg);
          this.spinnerService.hide();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  removeMsg(index) {
    this.messages.splice(index, 1);
  }

  pushMsgAndRemoveAfterInterval(msg: string) {
    this.messages.push(msg);
    setTimeout(() => {
      this.messages.pop();
    }, 3000);
  }

  public getFullName(forename: string, surname: string): string {
    const fullName = `${forename} ${surname}`;
    return fullName;
  }
}
