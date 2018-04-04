import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient';
import { SearchPipe } from '../search.pipe';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {

  private patients: any[] = null;
  private patients$: any = null;
  public patientsFound = false;
  public query = null;
  private patient_idToFind: string;

  constructor(private patientService: PatientService,
    private router: Router) { }

  getFullName(forename: string, surname: string): string {
    const fullName = `${forename} ${surname}`;
    return fullName;
  }

  goToNotes(patient) {
    console.log(patient._id);
    this.patient_idToFind = patient._id;
    this.patientService.patient_idToFind = this.patient_idToFind;
    this.router.navigateByUrl('/patient-notes');
  }

  ngOnInit() {
    this.patients$ = this.patientService.getPatients().subscribe(
      (data) => {
        console.log(data);
        const status = data['status'];
        if (status === 200) {
          // this.patients = data['data'];
          const rawData = data['data'];
          this.patients = rawData.map((patient) => {
            const formattedPatient = {
              _id: patient._id,
              patient_id: patient.patient_id,
              fullName: this.getFullName(patient.forename, patient.surname)
            }
            return formattedPatient;
          }
          );
          console.log(this.patients);
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        if (this.patients !== null) {
          this.patientsFound = true;
        }
      }
    );
  }

  ngOnDestroy() {
    // if (this.patient_idToFind !== null || this.patient_idToFind !== undefined) {
    //   this.patientService.patient_idToFind = null;
    // }
    this.patients$.unsubscribe();
    // this.loggedIn$.unsubscribe();
  }

}
