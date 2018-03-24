import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Patient } from '../models/patient';
import { Address } from '../models/address';
import { PatientService } from '../services/patient.service';
import { ClinicalNotes } from '../models/clinical-notes';
@Component({
  selector: 'app-patient-notes',
  templateUrl: './patient-notes.component.html',
  styleUrls: ['./patient-notes.component.css']
})
export class PatientNotesComponent implements OnInit, OnDestroy {

  private patient_id: string;
  private patientFound = false;
  private patient: Patient = null;

  constructor(private patientService: PatientService,
    private router: Router) { }

  ngOnInit() {
    console.log(this.patientService.patient_idToFind);
    this.patient_id = this.patientService.patient_idToFind;
    console.log(this.patient_id);

    if (this.patient_id !== null && this.patient_id !== undefined) {
      this.patientService.getPatientNotes(this.patient_id).subscribe((data) => {
        const status = data['status'];
        const patientData = data['data'];
        if (status === 200) {
          const { _id, patient_id, forename, surname, user_name, address, clinical_notes } = patientData;
          const addressObj = new Address(address['line1'], address['line2'], address['town_city'], address['postcode']);
          const notesObj = new ClinicalNotes(
            clinical_notes['diagnosis'],
            clinical_notes['notes'],
            clinical_notes['last_accessed'],
            clinical_notes['last_acc_by'],
            clinical_notes['medications']
          );
          console.log(addressObj);
          console.log(notesObj);
          this.patient = new Patient(_id, patient_id, user_name, forename, surname, addressObj, notesObj);
          this.patientFound = true;
        }
      });
      console.log('patient found');
    } else {
      this.router.navigateByUrl('/patients-list');
    }
  }

  // getFullName() {
  //   return this.patient.getFullName();
  // }

  ngOnDestroy() {
    this.patientService.patient_idToFind = null;
  }

}
