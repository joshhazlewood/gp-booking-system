import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Patient } from "../models/patient";
import { SearchPipe } from "../search.pipe";
import { PatientService } from "../services/patient.service";

@Component({
  selector: "app-patient-list",
  styleUrls: ["./patient-list.component.css"],
  templateUrl: "./patient-list.component.html",
})
export class PatientListComponent implements OnInit, OnDestroy {

  public patientsFound = false;
  public query = null;
  private patientIdToFind: string;
  private patients: any[] = null;
  private patients$: any = null;

  constructor(private patientService: PatientService,
              private router: Router) { }

  public getFullName(forename: string, surname: string): string {
    const fullName = `${forename} ${surname}`;
    return fullName;
  }

  public goToNotes(patient) {
    this.patientIdToFind = patient._id;
    this.patientService.patientIdToFind = this.patientIdToFind;
    this.router.navigateByUrl("/patient-notes");
  }

  public ngOnInit() {
    this.patients$ = this.patientService.getPatients().subscribe(
      (data: any) => {
        const status = data.status;
        if (status === 200) {
          // this.patients = data['data'];
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
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        if (this.patients !== null) {
          this.patientsFound = true;
        }
      },
    );
  }

  public ngOnDestroy() {
    this.patients$.unsubscribe();
  }

}
