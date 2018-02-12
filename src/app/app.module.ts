import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Http } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

const appRoutes: Routes = [
  { path: 'home', component: DashboardComponent },
  { path: 'staff-list', component: StaffListComponent },
  { path: 'patients-list', component: PatientListComponent },
  { path: 'new-appointment', component: NewAppointmentComponent },
  { path: 'appointments-list', component: AppointmentsComponent },
  { path: 'admin', component:  AdminPanelComponent},
  { path: '',
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
    NewAppointmentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule
  ],
  providers: [DataService, AppointmentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
