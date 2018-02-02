import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
// import { checkDateIsInFuture } from '../validators/year-in-future.validator';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { IMyDate } from '../../../node_modules/mydatepicker/dist/interfaces/my-date.interface';
import { Appointment } from '../models/appointment';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {

  private formIsValid = false;
  private dateSelected = false;
  private todaysDate = new Date();

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
  }

  isFormValidAndTouched(): boolean {
    // console.log('valid:' + this.myForm.valid + 'touched: ' + this.myForm.touched);
    return this.myForm.valid && this.myForm.touched;
  }

  findAppointments(): void {
    this.dateSelected = true;
    const appointments = [];
    const selectedDate = this.myForm.get('myDate').value['date'];
    const selectedYear = selectedDate.year;
    const selectedMonth = selectedDate.month - 1;
    const selectedDay = selectedDate.day;
    const startHour = 9;

    for(let i=0; i<17; i++) {
      let appointment = new Appointment();
      let hour: number = startHour + (i * 0.5);
      if(Number.isInteger(hour)) {
        // console.log('hour is int ' + hour);
        appointment.start_time = new Date(selectedYear, selectedMonth, selectedDay, hour);
        console.log(appointment.start_time);
      } else {
        // console.log('hour is not int ' + hour);
        appointment.start_time = new Date(selectedYear, selectedMonth, selectedDay, hour - 0.5, 30);
        console.log(appointment.start_time.getHours());
      }
    }
  }

}
