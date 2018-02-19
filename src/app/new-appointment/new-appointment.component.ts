import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { IMyDate } from '../../../node_modules/mydatepicker/dist/interfaces/my-date.interface';
import { PotentialAppointment } from '../models/potential-appointment';
import { TakenAppointment } from '../models/taken-appointment';
import { Appointment } from '../models/appointment';
import { AppointmentsService } from '../services/appointments.service';
import { StaffService } from '../services/staff.service';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {
  private formIsValid = false;
  private availableAppointmentsFound = false;
  private todaysDate = new Date();

  private potentialAppointments: PotentialAppointment[];
  private takenAppointments: TakenAppointment[];
  private availableAppointments: PotentialAppointment[];
  private sortedAppointments;

  // private doctors = ['doc1', 'doc2', 'doc3', 'doc4'];
  private doctors = [];

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    disableUntil: { year: this.todaysDate.getFullYear(), month: this.todaysDate.getMonth() + 1, day: this.todaysDate.getDate() - 1 }
  };

  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private appointmentsService: AppointmentsService, private staffService: StaffService) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      // Empty string or null means no initial value. Can be also specific date for
      // example: {date: {year: 2018, month: 10, day: 9}} which sets this date to initial
      // value.

      myDate: [null, Validators.required]
      // other controls are here...
    });
    this.staffService.getDoctors().subscribe( (res) => {
      let dataIsNull = false;

      const data = res['data'];
      if ( data === null ) {
        dataIsNull = true;
      } else {
        this.doctors = data.map( (app) => {
          return [app.staff_id, app.forename + ' ' + app.surname];
        });
      }
    }, (err) => {
      console.log(err);
    }, () => {
      console.log(this.doctors);
    });
  }

  getAppointmentsAndRemoveExisting(date: Date): void {
    let dataIsNull = false;

    this.appointmentsService.getAppointmentsOnDate(date).subscribe(res => {
      console.log('no err');
      const data = res['data'];
      if ( data === null ) {
        dataIsNull = true;
      } else {
        this.takenAppointments = data.map( (app) => {
          return new TakenAppointment(
            app.staff_name,
            app.start_time,
          );
        });
      }
    }, (err) => {
      console.log(err);
    }, () => {
      if ( dataIsNull ) {
        this.availableAppointments = this.potentialAppointments;
        this.sortedAppointments = this.sortAppointmentsByTimeAndDocName(this.availableAppointments);
        this.availableAppointmentsFound = true;
      } else {
        this.availableAppointments = this.removeExistingAppointments(this.potentialAppointments, this.takenAppointments);
        this.sortedAppointments = this.sortAppointmentsByTimeAndDocName(this.availableAppointments);
        this.availableAppointmentsFound = true;
      }
    });
  }

  setDate(): void {
    // Set today date using the patchValue function
    this.availableAppointmentsFound = false;

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
    this.availableAppointmentsFound = false;
  }

  isFormValidAndTouched(): boolean {
    return this.myForm.valid && this.myForm.touched;
  }

  findAppointments(): void {
    this.potentialAppointments = new Array<PotentialAppointment>();

    const selectedDate = this.myForm.get('myDate').value['date'];
    const selectedYear = selectedDate.year;
    const selectedMonth = selectedDate.month - 1;
    const selectedDay = selectedDate.day;
    const startHour = 9;

    this.doctors.forEach((doc) => {
      for (let i = 0; i < 17; i++) {
        const appointment = new PotentialAppointment();
        const hour: number = startHour + (i * 0.5);

        appointment.staff_id = doc[0];
        appointment.doctor = doc[1];

        if (this.isOnTheHour(hour)) {
          appointment.date = new Date(selectedYear, selectedMonth, selectedDay, hour);
          this.potentialAppointments.push(appointment);
        } else {
          appointment.date = new Date(selectedYear, selectedMonth, selectedDay, hour - 0.5, 30);
          this.potentialAppointments.push(appointment);
        }
      }
    });
    //  pass in the selected day to pull relevant appointments from the DB
    this.getAppointmentsAndRemoveExisting(new Date(selectedYear, selectedMonth, selectedDay));
  }

  sortAppointmentsByTimeAndDocName(array: PotentialAppointment[]): PotentialAppointment[] {
    const sortedArray = array.sort(function (date1, date2) {
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
    return sortedArray;
  }

  removeExistingAppointments(appointments: PotentialAppointment[], takenAppointments: TakenAppointment[]): PotentialAppointment[] {
    const availableAppointments = appointments.filter(function (app) {
      //  Returns NOT of takenAppointments.some because we filter out if
      //  the potential appointment is at the same time as any other appointment today.
      const appNotTaken = !takenAppointments.some((takenApp) => {
        const appTaken = (app.date.getTime() === new Date(takenApp.start_time).getTime() && app.doctor === takenApp.doctor);
        if (appTaken) {
          return true;
        }
        return false;
      });
      return appNotTaken;
    });
    return availableAppointments;
  }

  isOnTheHour(hour: number): boolean {
    return Number.isInteger(hour);
  }

  bookAppointment(appointment: PotentialAppointment) {
    // console.log(appointment);
    this.appointmentsService.createNewAppointment(appointment).subscribe(data => {
      console.log(data);
    });
  }

}
