import { Component, OnInit, ViewChild } from '@angular/core';

import { AppointmentsService } from '../services/appointments.service';
import { AuthService } from '../services/auth.service';
import { Event } from '../services/interfaces/event';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  public calendarOptions: Options;
  private appointments: any[] = null;
  private events: Event[] = null;
  private eventsFound = false;
  private displayEvent: any;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(private appointmentsService: AppointmentsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService
  ) { }

  getFullName(forename, surname): string {
    const fullName = `${forename} ${surname}`;
    return fullName;
  }

  ngOnInit() {
    const doc_id = this.authService.getUserId();
    this.spinnerService.show();
    this.appointmentsService.getDocsAppointments(doc_id)
      .subscribe(
        res => {
          this.spinnerService.hide();
          if (res['status'] === 200) {
            console.log(res);
            this.appointments = res['data'];

            if (this.appointments !== null) {
              this.events = this.appointments.map(
                app => {
                  const patientFName = app['patient']['forename'];
                  const patientSName = app['patient']['surname'];
                  const fullName = this.getFullName(patientFName, patientSName);
                  const start_time = app['start_time'];
                  const end_time = app['end_time'];
                  
                  const start_timeAsLocaleString: string = moment(start_time).format().toLocaleString();
                  const end_timeAsLocaleString: string = moment(end_time).format().toLocaleString();

                  const formatted_start_time = start_timeAsLocaleString.slice(0, -6);
                  const formatted_end_time = end_timeAsLocaleString.slice(0, -6);

                  const event = {
                    title: fullName,
                    start: formatted_start_time,
                    end: formatted_end_time
                  };

                  return event;
                }
              );
              this.eventsFound = true;
              this.calendarOptions = {
                editable: false,
                eventLimit: false,
                header: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'month,agendaWeek,agendaDay,listMonth'
                },
                events: this.events,
                handleWindowResize: true
                // aspectRatio: 1.85
              };
            }
          }
        },
        (err) => {
          console.log(err);
          this.spinnerService.hide();
        },
        () => {
          console.log('finished getting data');
        }
      );
  }

  clickButton(model: any) {
    this.displayEvent = model;
  }

}
