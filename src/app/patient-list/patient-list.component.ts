import { Component, OnInit } from '@angular/core';

import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  patients$: any = null;
  
  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.patients$ = this.patientService.getPatients().subscribe(
      (data) => {
        console.log(data);
      }, 
      (err) => {

      },
      () => {

      }
    );
  }

}
