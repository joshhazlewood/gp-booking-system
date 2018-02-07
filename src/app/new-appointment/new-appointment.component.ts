import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
// import { checkDateIsInFuture } from '../validators/year-in-future.validator';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { IMyDate } from '../../../node_modules/mydatepicker/dist/interfaces/my-date.interface';
import { PotentialAppointment } from '../models/potential-appointment';
import { TakenAppointment } from '../models/taken-appointment';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {

  private formIsValid = false;
  private appointmentsFound = false;
  private todaysDate = new Date();

  public appointments;
  private takeApp1;
  private takeApp2;
  private takeApp3;
  private takeApp4;

  private takenAppointments = [ ];
  private doctors = ['doc1', 'doc2', 'doc3', 'doc4' ];
  // private existingAppointments = [ new Date(2018, 2, 8, 9), new Date(2018, 2, 8, 9, 30), new Date(2018, 2, 8, 11) ];

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    disableUntil: { year: this.todaysDate.getFullYear(), month: this.todaysDate.getMonth() + 1, day: this.todaysDate.getDate() - 1 }
  };

  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.todaysDate.getFullYear());
    console.log(this.todaysDate.getMonth() + 1); // base 0 so + 1 month
    console.log(this.todaysDate.getDate());
    this.myForm = this.formBuilder.group({
      // Empty string or null means no initial value. Can be also specific date for
      // example: {date: {year: 2018, month: 10, day: 9}} which sets this date to initial
      // value.

      myDate: [null, Validators.required]
      // other controls are here...
    });
    this.takeApp1 = new TakenAppointment('doc1', new Date(2018, 1, 8, 9));
    // console.log(this.takeApp1.doctor);
    this.takeApp2 = new TakenAppointment('doc2', new Date(2018, 1, 8, 9, 30));
    this.takeApp3 = new TakenAppointment('doc3', new Date(2018, 1, 8, 11));
    this.takeApp4 = new TakenAppointment('doc4', new Date(2018, 1, 8, 11, 30));
    this.takenAppointments.push(this.takeApp1);
    this.takenAppointments.push(this.takeApp2);
    this.takenAppointments.push(this.takeApp3);
    this.takenAppointments.push(this.takeApp4);
    // this.takenAppointments.forEach((app) => {
    //   console.log(Object.keys(app));
    //   // console.log(app.doctor);
    // });
  }

  setDate(): void {
    // Set today date using the patchValue function
    this.appointmentsFound = false;

    const date = new Date();
    this.myForm.patchValue({
      myDate: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  clearDate(): void {
    // Clear the date using the patchValue function
    this.myForm.patchValue({ myDate: null });
    this.appointmentsFound = false;
  }

  isFormValidAndTouched(): boolean {
    return this.myForm.valid && this.myForm.touched;
  }

  findAppointments(): void {
    this.appointments = new Array();
    const selectedDate = this.myForm.get('myDate').value['date'];
    const selectedYear = selectedDate.year;
    const selectedMonth = selectedDate.month - 1;
    const selectedDay = selectedDate.day;
    const startHour = 9;

    this.doctors.forEach((doc) => {
      // console.log(doc);
      for (let i = 0; i < 17; i++) {
        const appointment = new PotentialAppointment();
        const hour: number = startHour + (i * 0.5);

        appointment.doctor = doc;
        // console.log('hour' + i + ' = ' + hour)
        // console.log(this.isOnTheHour())
        // console.log(this.isOnTheHour(10));
        if (this.isOnTheHour(hour)) {
          appointment.date = new Date(selectedYear, selectedMonth, selectedDay, hour);
          // console.log(appointment.date.toUTCString());
          this.appointments.push(appointment);
        } else {
          appointment.date = new Date(selectedYear, selectedMonth, selectedDay, hour - 0.5, 30);
          this.appointments.push(appointment);
        }
      }
    });
    // this.appointments.sort()
    console.log('pre-remove');
    // this.takenAppointments.forEach((app) => {
    //   console.log(app.start_time);
    //   console.log(app.doctor);
    // });
    // console.log('taken apps: ' + this.takenAppointments);
    this.removeExistingAppointments(this.appointments, this.takenAppointments);
    // this.takenAppointments.forEach(function(takenApp) {
    //   console.log('lol' + takenApp.doctor);
    // })
    console.log('post-remove');
    this.sortAppointmentsByTimeAndDocName(this.appointments);
    this.appointmentsFound = true;
  }

  sortAppointmentsByTimeAndDocName(array): void {
    array.sort(function (date1, date2) {
      if (date1.date < date2.date) {
        return -1;
      } else if (date1.date > date2.date) {
        return 1;
      } else {
        if (date1.doctor < date2.doctor) {
          return -1;
        } else if (date1.doctor > date2.doctor) {
          return 1;
        }
        return 0;
      }
    });
  }

  // filterByTimeAndDocName(array) {

  // }

  removeExistingAppointments(appointments, takenAppointments: TakenAppointment[]): void {
    console.log('trying to filter');
    appointments.filter( function(app) {
      // console.log('filtering');
      takenAppointments.map((takenApp) => {
        // console.log('first: ' + (app.date.getTime() === takenApp.start_time.getTime()));
        // console.log('first app date: ' + app.date );
        // console.log('first takenapp date: ' + takenApp.start_time);
        // console.log('2nd: ' + (app.doctor === takenApp.doctor));
        // console.log('2nd app doc: ' + app.doctor );
        // console.log('2nd takenapp doc: ' + takenApp.doctor);
        const appTaken = (app.date.getTime() === takenApp.start_time.getTime() && app.doctor === takenApp.doctor);
        console.log(appTaken);
        if (appTaken) {
          return false;
        }
        return true;
      });
      // return takenAppointments.filter( function(app2) {
      //   console.log('app2 = ' + typeof app2);
      //   const keys = Object.keys(app2);
      //   keys.forEach( x => console.log(x) );

      //   const result = app.date === app2.start_time && app.doctor === app2.doctor;
      //   // console.log('app.date' + app.date);
      //   // console.log('app2.starttime' + app2.start_time);
      //   // console.log('app.doctor' + app.doctor);
      //   // console.log('app2.doctor' + app2.doctor);
      //   // console.log('result: ' + result);
      //   return result;
      // }).length === 0;

      // console.log('trying to filter');
      // takenAppointments.array.forEach(element => {
      //   console.log('wot' + element.start_time + ' ' + app.date);
      //   console.log(element.doctor === app.doctor);
      //   if (element.start_time === app.date && element.doctor === app.doctor) {
      //     return false;
      //   }
      //   return true;
      // });
    });
  }

  isOnTheHour(hour: number): boolean {
    return Number.isInteger(hour);
  }

}
