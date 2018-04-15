import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { SearchPipe } from "../search.pipe";
import { PatientService } from "../services/patient.service";
import { StaffService } from "../services/staff.service";

@Component({
  selector: "app-admin-panel",
  styleUrls: ["./admin-panel.component.css"],
  templateUrl: "./admin-panel.component.html",
})
export class AdminPanelComponent implements OnInit {

  public activeTab: string = null;
  public patients: any[] = null;
  public staff: any[] = null;
  public patientsFound: boolean = null;
  public staffFound: boolean = null;
  public patientQuery = null;
  public staffQuery = null;
  private patients$: any = null;
  private staff$: any = null;

  constructor(private patientService: PatientService,
              private staffService: StaffService,
              private spinnerService: Ng4LoadingSpinnerService,
              private router: Router) {

  }

  public ngOnInit() {
    this.activeTab = "patient";
    this.spinnerService.show();
    this.patients$ = this.patientService.getPatients().subscribe(
      (data: any) => {
        const status = data.status;
        if (status === 200) {
          // this.spinnerService.hide();
          const rawData = data.data;
          this.patients = rawData.map((patient) => {
            const formattedPatient = {
              _id: patient._id,
              fullName: this.getFullName(patient.forename, patient.surname),
              patient_id: patient.patient_id,
            };
            return formattedPatient;
          },
          );
          this.patientsFound = true;
        }
      },
      (err) => {
        this.spinnerService.hide();
      },
    );

    this.staff$ = this.staffService.getStaff().subscribe(
      (data: any) => {
        const status = data.status;
        if (status === 200) {
          this.spinnerService.hide();
          const rawData = data.data;
          this.staff = rawData.map((staffMember) => {
            const formattedStaffMember = {
              _id: staffMember._id,
              fullName: this.getFullName(staffMember.forename, staffMember.surname),
              staff_id: staffMember.staff_id,
            };
            return formattedStaffMember;
          },
          );
          this.staffFound = true;
        } else if (status.toString().startsWith("4")) {
          console.log("Error connecting to database.");
        }
      },
      (err) => {
        this.spinnerService.hide();
        console.log(err);
      },
    );
  }

  public showTab(tab) {
    this.activeTab = tab;
  }

  public getFullName(forename: string, surname: string): string {
    const fullName = `${forename} ${surname}`;
    return fullName;
  }

  public editPatient(patient) {
    this.router.navigateByUrl(`/edit-patient/${patient._id}`);
  }

  public editStaff(staff) {
    this.router.navigateByUrl(`/edit-staff/${staff._id}`);
  }

  public goToNewPatientComponent() {
    this.router.navigateByUrl("/new-patient");
  }

  public goToNewStaffComponent() {
    this.router.navigateByUrl("/new-staff");
  }
}
