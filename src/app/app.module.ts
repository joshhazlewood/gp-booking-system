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
import { AuthService } from './services/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'new-appointment', component: NewAppointmentComponent },
  { path: 'staff-list', component: StaffListComponent },
  { path: 'patients-list', component: PatientListComponent },
  { path: 'appointments-list', component: AppointmentsComponent },
  { 
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuardService],
    data: { 
      expectedRole: 'admin'
    }
  },
  { path: '',
    redirectTo: '/login',
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
    LoginComponent
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
    MyDatePickerModule
  ],
  providers: [
    DataService,
    AppointmentsService,
    StaffService,
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
