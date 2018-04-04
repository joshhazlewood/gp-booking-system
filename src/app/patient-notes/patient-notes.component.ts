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
  public patientFound = false;
  private patient: Patient = null;
  private patients$: any = null;
  private canEditNotes = false;
  private editiedNotes: any = null;
  private newName: string = null;
  private newAmount: number = null;
  private newUnit: string = null;
  private messages: string[] = null;

  constructor(private patientService: PatientService,
    private router: Router) { }

  editNotes() {
    this.canEditNotes = true;
  }

  saveNotes() {
    const notesToSave = this.patient.clinical_notes;
    this.canEditNotes = false;
    this.patientService.savePatientNotes(this.patient_id, this.patient.clinical_notes).subscribe(
      res => {
        const status = res['status'];
        if (status === 200) {
          console.log('notes updated');
          this.messages.push('Patient Notes Updated.');
        } else if (status.toString().startsWith(4)) {
          this.messages.push('Patient Notes failed to save.');
        }
      }
    );
  }

  addMedication() {
    const valid = this.newName !== null && this.newAmount !== null && this.newUnit !== null;
    if (valid === true) {
      const medications = this.patient.clinical_notes.medications;
      const medication = {
        name: this.newName,
        amount: this.newAmount,
        unit: this.newUnit
      };
      medications.push(medication);
      this.setMedFieldsNull();
    } else {
      this.messages.push('Please enter all fields before trying to add a medication');
    }
  }

  removeMed(index) {
    const medications = this.patient.clinical_notes.medications;
    medications.splice(index, 1);
  }

  setMedFieldsNull() {
    this.newName = null;
    this.newAmount = null;
    this.newUnit = null;
  }

  removeMsg(index) {
    this.messages.splice(index, 1);
  }

  ngOnInit() {
    this.patient_id = this.patientService.patient_idToFind;
    this.messages = [];

    if (this.patient_id !== null && this.patient_id !== undefined) {
      this.patients$ = this.patientService.getPatientNotes(this.patient_id).subscribe((data) => {
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
    if (this.patients$ !== null) {
      this.patients$.unsubscribe();
    }
    this.patientService.patient_idToFind = null;
  }

}
