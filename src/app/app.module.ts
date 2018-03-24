import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { Http } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';

import { MyDatePickerModule } from 'mydatepicker';
import { FullCalendarModule } from 'ng-fullcalendar';

import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { AppointmentsService } from './services/appointments.service';
import { StaffService } from './services/staff.service';
import { PatientService } from './services/patient.service';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ConfirmAppComponent } from './confirm-app/confirm-app.component';
import { SearchPipe } from './search.pipe';
import { PatientNotesComponent } from './patient-notes/patient-notes.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent },
  {
    path: 'new-appointment',
    component: NewAppointmentComponent,
    canActivate: [AuthGuardService],
    data: {
      expectedRole: 'patient'
    }
  },
  { path: 'confirm-app', component: ConfirmAppComponent },
  { path: 'staff-list', component: StaffListComponent },
  {
    path: 'patients-list',
    component: PatientListComponent,
    canActivate: [AuthGuardService],
    data: {
      expectedRole: 'doctor'
    }
  },
  {
    path: 'patient-notes',
    component: PatientNotesComponent,
    canActivate: [AuthGuardService],
    data: {
      expectedRole: 'doctor',
    }
  },
  {
    path: 'appointments-list',
    component: AppointmentsComponent,
    canActivate: [AuthGuardService],
    data: {
      expectedRole: 'doctor'
    }
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuardService],
    data: {
      expectedRole: 'admin'
    }
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
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
    PatientNotesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    FullCalendarModule
  ],
  providers: [
    DataService,
    AppointmentsService,
    StaffService,
    PatientService,
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
