import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PatientService } from '../services/patient.service';
import { StaffService } from '../services/staff.service';
import { SearchPipe } from '../search.pipe';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  public activeTab: string = null;
  private patients$: any = null;
  public patients: any[] = null;
  private staff$: any = null;
  public staff: any[] = null;
  public patientsFound: boolean = null;
  public staffFound: boolean = null;
  public patientQuery = null;
  public staffQuery = null;

  constructor(private patientService: PatientService,
    private staffService: StaffService,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router) {

  }

  ngOnInit() {
    this.activeTab = 'patient';
    this.spinnerService.show();
    this.patients$ = this.patientService.getPatients().subscribe(
      (data) => {
        const status = data['status'];
        if (status === 200) {
          // this.spinnerService.hide();
          const rawData = data['data'];
          this.patients = rawData.map((patient) => {
            const formattedPatient = {
              _id: patient._id,
              patient_id: patient.patient_id,
              fullName: this.getFullName(patient.forename, patient.surname)
            };
            return formattedPatient;
          }
          );
          this.patientsFound = true;
        }
      },
      (err) => {
        this.spinnerService.hide();
        console.log(err);
      }
    );

    this.staff$ = this.staffService.getStaff().subscribe(
      (data) => {
        const status = data['status'];
        if (status === 200) {
          this.spinnerService.hide();
          const rawData = data['data'];
          this.staff = rawData.map((staffMember) => {
            const formattedStaffMember = {
              _id: staffMember._id,
              staff_id: staffMember.staff_id,
              fullName: this.getFullName(staffMember.forename, staffMember.surname)
            };
            return formattedStaffMember;
          }
          );
          this.staffFound = true;
        }
      },
      (err) => {
        this.spinnerService.hide();
        console.log(err);
      }
    );
  }

  showTab(tab) {
    this.activeTab = tab;
  }

  getFullName(forename: string, surname: string): string {
    const fullName = `${forename} ${surname}`;
    return fullName;
  }

  editPatient(patient) {
    this.router.navigateByUrl(`/edit-patient/${patient._id}`);
  }

  editStaff(staff) {
    this.router.navigateByUrl(`/edit-staff/${staff._id}`);
  }

}
