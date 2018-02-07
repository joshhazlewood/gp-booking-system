import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
// import { checkDateIsInFuture } from '../validators/year-in-future.validator';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { IMyDate } from '../../../node_modules/mydatepicker/dist/interfaces/my-date.interface';
import { PotentialAppointment } from '../models/potential-appointment';

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
  private doctors = ['doc1', 'doc2', 'doc3', 'doc4'];

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    disableUntil: { year: this.todaysDate.getFullYear(), month: this.todaysDate.getMonth() + 1, day: this.todaysDate.getDate() - 1 }
  };

  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.todaysDate.getFullYear());
    console.log(this.todaysDate.getMonth() + 1);
    console.log(this.todaysDate.getDate());
    this.myForm = this.formBuilder.group({
      // Empty string or null means no initial value. Can be also specific date for
      // example: {date: {year: 2018, month: 10, day: 9}} which sets this date to initial
      // value.

      myDate: [null, Validators.required]
      // other controls are here...
    });
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
      console.log(doc);
      for (let i = 0; i < 17; i++) {
        const appointment = new PotentialAppointment();
        const hour: number = startHour + (i * 0.5);

        appointment.doctor = doc;
        console.log('hour' + i + ' = ' + hour)
        // console.log(this.isOnTheHour())
        // console.log(this.isOnTheHour(10));
        if (this.isOnTheHour(hour)) {
          appointment.date = new Date(selectedYear, selectedMonth, selectedDay, hour);
          this.appointments.push(appointment);
        } else {
          appointment.date = new Date(selectedYear, selectedMonth, selectedDay, hour - 0.5, 30);
          this.appointments.push(appointment);
        }
      }
    });
    this.sortAppointmentsByTimeAndDocName();
    // this.appointments.sort()
    this.appointmentsFound = true;
  }

  sortAppointmentsByTimeAndDocName(): void {
    this.appointments.sort(function(date1, date2) {
      let result = 0;
      if(date1.date < date2.date) {
        return -1;
      } else if(date1.date > date2.date) {
        return 1;
      } else {
        if (date1.doctor < date2.doctor) {
          return -1;
        } else if (date1.doctor > date2.doctor) {
          return 1;    
        }
        return 0;
      }
    })
  }

  isOnTheHour(hour: number): boolean {
    return Number.isInteger(hour);
  }

}
