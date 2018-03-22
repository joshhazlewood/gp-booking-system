import { Component, OnInit, ViewChild } from '@angular/core';

import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  private calendarOptions: Options;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor() { }

  ngOnInit() {
  //   this.calendarOptions = {
  //     editable: true,
  //     eventLimit: false,
  //     header: {
  //       left: 'prev,next today',
  //       center: 'title',
  //       right: 'month,agendaWeek,agendaDay,listMonth'
  //     },
  //     events: data
  //   };
  }

}
