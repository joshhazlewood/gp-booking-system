import { Component, OnInit, ViewChild } from "@angular/core";

import { Options } from "fullcalendar";
import * as moment from "moment";
import { CalendarComponent } from "ng-fullcalendar";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { AppointmentsService } from "../services/appointments.service";
import { AuthService } from "../services/auth.service";
import { IEvent as Event } from "../services/interfaces/event";

@Component({
  selector: "app-appointments",
  styleUrls: ["./appointments.component.css"],
  templateUrl: "./appointments.component.html",
})
export class AppointmentsComponent implements OnInit {

  @ViewChild(CalendarComponent) public ucCalendar: CalendarComponent;

  public calendarOptions: Options;
  private appointments: any[] = null;
  private events: Event[] = null;
  private eventsFound = false;
  private displayEvent: any;

  /* tslint:disable:align*/
  constructor(private appointmentsService: AppointmentsService, private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService,
  ) { }
  /* tslint:enable:align*/

  public getFullName(forename, surname): string {
    const fullName = `${forename} ${surname}`;
    return fullName;
  }

  public ngOnInit() {
    const docId = this.authService.getUserId();
    this.spinnerService.show();
    this.appointmentsService.getDocsAppointments(docId)
      .subscribe(
        (res: any) => {
          this.spinnerService.hide();
          if (res.status === 200) {
            this.appointments = res.data;

            if (this.appointments !== null) {
              this.events = this.appointments.map(
                (app) => {
                  const patientFName = app.patient.forename;
                  const patientSName = app.patient.surname;
                  const fullName = this.getFullName(patientFName, patientSName);
                  const startTime = app.start_time;
                  const endTime = app.end_time;

                  const startTimeAsLocaleString: string = moment(startTime).format().toLocaleString();
                  const endTimeAsLocaleString: string = moment(endTime).format().toLocaleString();

                  const formattedStartTime = startTimeAsLocaleString.slice(0, -6);
                  const formattedEndTime = endTimeAsLocaleString.slice(0, -6);

                  const event = {
                    end: formattedEndTime,
                    start: formattedStartTime,
                    title: fullName,
                  };

                  return event;
                },
              );
              this.eventsFound = true;
              this.calendarOptions = {
                editable: false,
                eventLimit: false,
                events: this.events,
                handleWindowResize: true,
                header: {
                  center: "title",
                  left: "prev,next today",
                  right: "month,agendaWeek,agendaDay,listMonth",
                },
                // aspectRatio: 1.85
              };
            }
          }
        },
        (err) => {
          this.spinnerService.hide();
        },
    );
  }

  public clickButton(model: any) {
    this.displayEvent = model;
  }

}
