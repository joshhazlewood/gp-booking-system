import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { IMyDate } from '../../../node_modules/mydatepicker/dist/interfaces/my-date.interface';
import { PotentialAppointment } from '../models/potential-appointment';
import { TakenAppointment } from '../models/taken-appointment';
import { Appointment } from '../models/appointment';
import { Doctor } from '../models/doctor';
import { AppointmentsService } from '../services/appointments.service';
import { StaffService } from '../services/staff.service';
import { AuthService } from '../services/auth.service';
import { User } from '../services/interfaces/user';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {
  private formIsValid = false;
  public availableAppointmentsFound = false;
  private todaysDate = new Date();

  private potentialAppointments: PotentialAppointment[];
  private takenAppointments: TakenAppointment[];
  private availableAppointments: PotentialAppointment[];
  private sortedAppointments;
  private appToConfirm: PotentialAppointment = null;

  private doctors = [];
  private errors: string[] = null;
  private user: User = null;
  private isLoggedIn: boolean = null;
  private showModal: boolean = null;
  private confirmApp: boolean = null;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    disableUntil: { year: this.todaysDate.getFullYear(), month: this.todaysDate.getMonth() + 1, day: this.todaysDate.getDate() - 1 }
  };

  public myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentsService: AppointmentsService,
    private staffService: StaffService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      // Empty string or null means no initial value. Can be also specific date for
      // example: {date: {year: 2018, month: 10, day: 9}} which sets this date to initial
      // value.

      myDate: [null, Validators.required]
      // other controls are here...
    });
    this.confirmApp = false;
    this.errors = [];

    // Get all the doctors ready for appointments
    this.staffService.getDoctors().subscribe((res) => {
      let dataIsNull = false;
      if (res['status'] === 200) {
        const data = res['data'];

        this.doctors = data.map((doc) => {
          const { _id, staff_id, forename, surname } = doc;
          return new Doctor(_id, staff_id, forename, surname);
        });
      } else {
        dataIsNull = true;
      }
    }, (err) => {
      console.log(err);
    });
    console.log('initialised');

    this.authService.isLoggedIn().subscribe(
      value => {
        this.isLoggedIn = true;

        if (value === true) {

          if (this.user === null) {
            const user_id = this.authService.getToken()['user_id'];
            // console.log(user_id);
            this.authService.getUserDetails(user_id).subscribe(
              res => {
                if (res['status'] === 200) {
                  const { _id, user_name } = res['data'];
                  this.user = {
                    user_id: _id,
                    user_name: user_name,
                    user_role: 'patient'
                  };
                  console.log(this.user);
                }
              }
            );
          }
        } else {
          console.log('setting null');
          this.user = null;
        }
      }
    );
  }

  getAppointmentsAndRemoveExisting(date: Date): void {
    let dataIsNull = false;
    this.appointmentsService.getAppointmentsOnDate(date).subscribe(res => {
      const data = res['data'];
      if (data === null) {
        dataIsNull = true;
      } else {
        this.takenAppointments = data.map((app) => {
          return new TakenAppointment(
            app.staff_id,
            app.start_time,
          );
        });
      }
    },
      (err) => {
        console.log(err);
      },
      () => {
        if (dataIsNull) {
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
        const docForename = doc.forename;
        const docSurname = doc.surname;
        const docName = this.concatName(docForename, docSurname);

        appointment.staff_id = doc._id;
        appointment.doctor = doc;

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
    console.log('triggers getAppAndRemoveExisitng');
    this.getAppointmentsAndRemoveExisting(new Date(selectedYear, selectedMonth, selectedDay));
  }

  sortAppointmentsByTimeAndDocName(array: PotentialAppointment[]): PotentialAppointment[] {
    const sortedArray = array.sort(function (date1, date2) {
      if (date1.date < date2.date) {
        return -1;
      } else if (date1.date > date2.date) {
        return 1;
      } else {
        if (date1.doctor.getFullName() < date2.doctor.getFullName()) {
          return -1;
        } else if (date1.doctor.getFullName() > date2.doctor.getFullName()) {
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
        const appTaken = (app.date.getTime() === new Date(takenApp.start_time).getTime() && app.doctor._id === takenApp.doctor_id);
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

  concatName(forename, surname): string {
    const fullName = `${forename} ${surname}`;
    return fullName;
  }

  bookAppointment(appointment: PotentialAppointment) {
    console.log(appointment);
    // const user = this.authService.getUser();
    this.showModal = true;
    this.confirmApp = true;
    this.appToConfirm = appointment;
    this.appToConfirm.patient_id = this.user.user_id;

    // const patient_id = user.user_id;
    // const staff_id = appointment.doctor._id;
    // const start_time = appointment.date;
    // // const end_time = '';
    // const newApp = new Appointment(patient_id, staff_id, start_time);
    // // console.log(newApp);
    // this.appointmentsService.createNewAppointment(newApp).subscribe(data => {
    //   console.log(data);
    // });
  }

  completeAppointment() {
    this.appointmentsService.createNewAppointment(this.appToConfirm).subscribe(
      res => {
        const status = res['status'];
        if (status === 200) {
          this.appointmentsService.confirmationData = this.appToConfirm;
          this.router.navigateByUrl('/confirm-app');
          console.log('Created appointment');
        } else if (status === 409) {
          this.errors.push('Sorry, that appointment has already been taken. Please try another.');
          this.closeModal();
          this.findAppointments();
          console.log('Appointment already taken');
        } else {
          console.log('Server error');
          this.findAppointments();
        }
      }
    );
  }

  closeModal() {
    this.showModal = false;
    this.confirmApp = false;
  }

  removeErrMsg(index) {
    this.errors.splice(index, 1);
  }

}
