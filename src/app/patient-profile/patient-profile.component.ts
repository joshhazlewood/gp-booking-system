import { Component, OnInit } from "@angular/core";

import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Address } from "../models/address";
import { PatientProfile } from "../models/patient-profile";
import { AppointmentsService } from "../services/appointments.service";
import { AuthService } from "../services/auth.service";
import { PatientService } from "../services/patient.service";

import { IAppointment as Appointment } from "../services/interfaces/appointment";

@Component({
  selector: "app-patient-profile",
  styleUrls: ["./patient-profile.component.css"],
  templateUrl: "./patient-profile.component.html",
})
export class PatientProfileComponent implements OnInit {

  public messages: string[] = null;
  public user: PatientProfile = null;
  public userFound: boolean = null;
  public appointmentsFound: boolean = null;
  public hasNoAppointments: boolean = null;
  public appointments: any[];
  private userId: string = null;

  /* tslint:disable:max-line-length */
  constructor(private patientService: PatientService, private authService: AuthService, private spinnerService: Ng4LoadingSpinnerService,
              private appointmentsService: AppointmentsService) { }

  public ngOnInit() {
    this.userFound = false;
    this.appointmentsFound = false;
    this.spinnerService.show();
    this.messages = [];
    this.appointments = [];
    this.userId = this.authService.getUserId();
    this.getPatientData();
    this.getAppointmentsData();
  }

  public getFullName(forename: string, surname: string): string {
    const fullName = `${forename} ${surname}`;
    return fullName;
  }

  public removeMsg(index) {
    this.messages.splice(index, 1);
  }

  private getPatientData() {
    this.patientService.getPatientById(this.userId).subscribe(
      (response: any) => {
        const status: number = response.status;
        if (status === 200) {
          const data = response.data;
          const rawAddress = data.address;

          const address: Address = {
            line1: rawAddress.line1,
            line2: rawAddress.line2,
            postcode: rawAddress.postcode,
            town_city: rawAddress.town_city,
          };
          this.user = {
            _id: data._id,
            address,
            forename: data.forename,
            patientId: data.patient_id,
            surname: data.surname,
            username: data.user_name,
          };
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
      },
    );
  }

  private getAppointmentsData() {
    this.spinnerService.show();
    this.appointmentsService.getPatientsAppointments(this.userId).subscribe(
      (response: any) => {
        console.log(response);
        const status: number = response.status;
        if (status === 200) {
          const data = response.data;
          // this.appointments = data;
          if (data.length > 0) {
            data.forEach((element) => {
              const docName = this.getFullName(element.staff.forename, element.staff.surname);
              const app: Appointment = {
                doctor: docName,
                start_time: new Date(element.start_time),
              };
              this.appointments.push(app);
            });
          }
          this.spinnerService.hide();
        } else if (status.toString().startsWith("4")) {
          this.hasNoAppointments = true;
          this.spinnerService.hide();
        }
        this.appointmentsFound = true;
      },
      (err) => {
        const msg = "Error getting user profile data. Please refresh the page.";
        this.pushMsgAndRemoveAfterInterval(msg);
        this.spinnerService.hide();
      },
    );
  }

  private pushMsgAndRemoveAfterInterval(msg: string) {
    this.messages.push(msg);
    setTimeout(() => {
      this.messages.pop();
    }, 3000);
  }

}
