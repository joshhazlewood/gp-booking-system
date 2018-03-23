import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {

  private patients: any[] = null;
  private patients$: any = null;

  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.patients$ = this.patientService.getPatients().subscribe(
      (data) => {
        console.log(data);
        const status = data['status'];
        if (status === 200) {
          this.patients = data['data'];
          console.log(this.patients);
        }
      }
    );
  }

  ngOnDestroy() {
    this.patients$.unsubscribe();
    // this.loggedIn$.unsubscribe();
  }

}
