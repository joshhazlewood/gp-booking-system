import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { MessagesComponent } from "../messages/messages.component";

import { Address } from "../models/address";
import { ClinicalNotes } from "../models/clinical-notes";
import { Patient } from "../models/patient";
import { PatientService } from "../services/patient.service";
@Component({
  selector: "app-patient-notes",
  styleUrls: ["./patient-notes.component.css"],
  templateUrl: "./patient-notes.component.html",
})
export class PatientNotesComponent implements OnInit, OnDestroy {

  public patientFound = false;
  private patientId: string;
  private patient: Patient = null;
  private patients$: any = null;
  private canEditNotes = false;
  private editiedNotes: any = null;
  private newName: string = null;
  private newAmount: number = null;
  private newUnit: string = null;
  private messages: string[] = null;
  private patientNotesPreEdit: any = null;

  constructor(private patientService: PatientService,
              private router: Router) { }

  public ngOnInit() {
    this.patientId = this.patientService.patientIdToFind;
    this.messages = [];
    this.getPatientData();
  }
  public editNotes() {
    this.canEditNotes = true;
    this.patientNotesPreEdit = Object.assign({}, this.patient.clinical_notes);
  }

  public cancelEdit() {
    this.getPatientData();
    this.canEditNotes = false;
  }

  public saveNotes() {
    const notesToSave = this.patient.clinical_notes;
    this.canEditNotes = false;
    this.patientService.savePatientNotes(this.patientId, this.patient.clinical_notes).subscribe(
      (res: any) => {
        const status = res.status;
        if (status === 200) {
          const msg = "Patient Notes Updated.";
          this.pushMsgAndRemoveAfterInterval(msg);
        } else if (status.toString().startsWith(4)) {
          const msg = "Patient Notes failed to save.";
          this.pushMsgAndRemoveAfterInterval(msg);
        }
      },
    );
  }

  public addMedication() {
    const valid = this.newName !== null && this.newAmount !== null && this.newUnit !== null;
    if (valid === true) {
      const medications = this.patient.clinical_notes.medications;
      const medication = {
        amount: this.newAmount,
        name: this.newName,
        unit: this.newUnit,
      };
      medications.push(medication);
      this.setMedFieldsNull();
    } else {
      const msg = "Please enter all fields before trying to add a medication";
      this.pushMsgAndRemoveAfterInterval(msg);
    }
  }

  public removeMed(index) {
    const medications = this.patient.clinical_notes.medications;
    medications.splice(index, 1);
  }

  public setMedFieldsNull() {
    this.newName = null;
    this.newAmount = null;
    this.newUnit = null;
  }

  public removeMsg(index) {
    this.messages.splice(index, 1);
  }

  public getPatientData() {
    if (this.patientId !== null && this.patientId !== undefined) {
      this.patients$ = this.patientService.getPatientNotes(this.patientId).subscribe((data: any) => {
        const status = data.status;
        const patientData = data.data;
        if (status === 200) {
          const { _id, patient_id, forename, surname, user_name, address, clinical_notes } = patientData;
          const addressObj = new Address(address.line1, address.line2, address.town_city, address.postcode);
          const notesObj = new ClinicalNotes(
            clinical_notes.diagnosis,
            clinical_notes.notes,
            clinical_notes.last_accessed,
            clinical_notes.last_acc_by,
            clinical_notes.medications,
          );
          this.patient = new Patient(_id, patient_id, user_name, forename, surname, addressObj, notesObj);
          this.patientFound = true;
        }
      });
    } else {
      this.router.navigateByUrl("/patients-list");
    }
  }

  public pushMsgAndRemoveAfterInterval(msg: string) {
    this.messages.push(msg);
    setTimeout(() => {
      this.messages.pop();
    }, 3000);
  }

  public ngOnDestroy() {
    if (this.patients$ !== null) {
      this.patients$.unsubscribe();
    }
    this.patientService.patientIdToFind = null;
  }

}
