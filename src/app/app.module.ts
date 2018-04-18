import { HttpClientModule } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { HttpModule } from '@angular/http';
import { Http } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { AuthInterceptor } from "./auth/auth-interceptor";

import { MomentModule } from "angular2-moment";
import { MyDatePickerModule } from "mydatepicker";
import { FullCalendarModule } from "ng-fullcalendar";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";

import { AdminPanelComponent } from "./admin-panel/admin-panel.component";
import { AppComponent } from "./app.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { LoginComponent } from "./auth/login/login.component";
import { ConfirmAppComponent } from "./confirm-app/confirm-app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EditPatientComponent } from "./edit-patient/edit-patient.component";
import { EditStaffComponent } from "./edit-staff/edit-staff.component";
import { MessagesComponent } from "./messages/messages.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { NewAppointmentComponent } from "./new-appointment/new-appointment.component";
import { NewPatientComponent } from "./new-patient/new-patient.component";
import { NewStaffComponent } from "./new-staff/new-staff.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { PatientListComponent } from "./patient-list/patient-list.component";
import { PatientNotesComponent } from "./patient-notes/patient-notes.component";
import { PatientProfileComponent } from "./patient-profile/patient-profile.component";
import { SearchPipe } from "./search.pipe";
import { AppointmentsService } from "./services/appointments.service";
import { AuthGuardService } from "./services/auth-guard.service";
import { AuthService } from "./services/auth.service";
import { DataService } from "./services/data.service";
import { PatientService } from "./services/patient.service";
import { StaffService } from "./services/staff.service";
import { StaffListComponent } from "./staff-list/staff-list.component";

const appRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: DashboardComponent },
  {
    canActivate: [AuthGuardService],
    component: NewAppointmentComponent,
    data: {
      expectedRole: "patient",
    },
    path: "new-appointment",
  },
  { path: "confirm-app", component: ConfirmAppComponent },
  { path: "staff-list", component: StaffListComponent },
  {
    canActivate: [AuthGuardService],
    component: PatientListComponent,
    data: {
      expectedRole: "doctor",
    },
    path: "patients-list",
  },
  {
    canActivate: [AuthGuardService],
    component: PatientNotesComponent,
    data: {
      expectedRole: "doctor",
    },
    path: "patient-notes",
  },
  {
    canActivate: [AuthGuardService],
    component: AppointmentsComponent,
    data: {
      expectedRole: "doctor",
    },
    path: "appointments-list",
  },
  {
    canActivate: [AuthGuardService],
    component: AdminPanelComponent,
    data: {
      expectedRole: "admin",
    },
    path: "admin",
  },
  {
    canActivate: [AuthGuardService],
    component: EditPatientComponent,
    data: {
      expectedRole: "admin",
    },
    path: "edit-patient/:id",
  },
  {
    canActivate: [AuthGuardService],
    component: EditStaffComponent,
    data: {
      expectedRole: "admin",
    },
    path: "edit-staff/:id",
  },
  {
    canActivate: [AuthGuardService],
    component: NewStaffComponent,
    data: {
      expectedRole: "admin",
    },
    path: "new-staff",
  },
  {
    canActivate: [AuthGuardService],
    component: NewPatientComponent,
    data: {
      expectedRole: "admin",
    },
    path: "new-patient",
  },
  {
    canActivate: [AuthGuardService],
    component: PatientProfileComponent,
    data: {
      expectedRole: "patient",
    },
    path: "patient-profile",
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home",
  },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    PageNotFoundComponent,
    StaffListComponent,
    PatientListComponent,
    AppointmentsComponent,
    AdminPanelComponent,
    NewAppointmentComponent,
    LoginComponent,
    ConfirmAppComponent,
    SearchPipe,
    PatientNotesComponent,
    EditPatientComponent,
    EditStaffComponent,
    NewStaffComponent,
    NewPatientComponent,
    MessagesComponent,
    PatientProfileComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }, // <-- debugging purposes only
    ),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    FullCalendarModule,
    Ng4LoadingSpinnerModule.forRoot(),
    MomentModule,
  ],
  providers: [
    DataService,
    AppointmentsService,
    StaffService,
    PatientService,
    AuthService,
    AuthGuardService,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
    },
  ],
})
export class AppModule { }
