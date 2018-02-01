import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
// import { checkDateIsInFuture } from '../validators/year-in-future.validator';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { IMyDate } from '../../../node_modules/mydatepicker/dist/interfaces/my-date.interface';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {

  private formIsValid = false;
  private todaysDate = new Date();

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
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

      myDate: [null, Validators.required],
      disableUntil: { year: this.todaysDate.getFullYear(), month: this.todaysDate.getMonth() + 1, day: this.todaysDate.getDate() }
      // other controls are here...
    });
  }

//   disableUntil() {
//     const d: date = new Date();
//     d.setDate(d.getDate() - 1);
//     let copy = this.getCopyOfOptions();
//     copy.disableUntil = {year: d.getFullYear(), 
//                          month: d.getMonth() + 1, 
//                          day: d.getDate()};
//     this.myOptions = copy;
// }

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
    // console.log('asdsad');
  }

  clearDate(): void {
    // Clear the date using the patchValue function
    this.myForm.patchValue({ myDate: null });
  }

  isFormValidAndTouched(): boolean {
    // console.log('valid:' + this.myForm.valid + 'touched: ' + this.myForm.touched);
    return this.myForm.valid && this.myForm.touched;
  }

}
