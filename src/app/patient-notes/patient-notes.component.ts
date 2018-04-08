import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { MessagesComponent } from "../messages/messages.component";

import { Address } from "../models/address";
import { ClinicalNotes } from "../models/clinical-notes";
import { Patient } from "../models/patient";

import { AuthService } from "../services/auth.service";
import { PatientService } from "../services/patient.service";
@Component({
  selector: "app-patient-notes",
  templateUrl: "./patient-notes.component.html",
  styleUrls: ["./patient-notes.component.css"]
})
export class PatientNotesComponent implements OnInit, OnDestroy {

  private patient_id: string;
  private staffId: string;
  public patientFound = false;
  private patient: Patient = null;
  private patients$: any = null;
  private canEditNotes = false;
  private editiedNotes: any = null;
  private newName: string = null;
  private newAmount: number = null;
  private newUnit: string = null;
  private messages: Array<string> = null;
  private patientNotesPreEdit: any = null;

  constructor(private patientService: PatientService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.patient_id = this.patientService.patient_idToFind;
    this.staffId = this.authService.getUserId();
    this.messages = [];
    this.getPatientData();
  }
  editNotes() {
    this.canEditNotes = true;
    this.patientNotesPreEdit = Object.assign({}, this.patient.clinical_notes);
  }

  cancelEdit() {
    this.getPatientData();
    this.canEditNotes = false;
  }

  saveNotes() {
    const notesToSave = this.patient.clinical_notes;
    this.canEditNotes = false;
    this.patientService.savePatientNotes(this.patient_id, this.staffId, this.patient.clinical_notes).subscribe(
      (res) => {
        const status = res["status"];
        if (status === 200) {
          const msg = "Patient Notes Updated.";
          this.pushMsgAndRemoveAfterInterval(msg);
        } else if (status.toString().startsWith(4)) {
          const msg = "Patient Notes failed to save.";
          this.pushMsgAndRemoveAfterInterval(msg);
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
      const msg = "Please enter all fields before trying to add a medication";
      this.pushMsgAndRemoveAfterInterval(msg);
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

  getPatientData() {
    if (this.patient_id !== null && this.patient_id !== undefined) {
      this.patients$ = this.patientService.getPatientNotes(this.patient_id, this.staffId).subscribe((data) => {
        const status = data["status"];
        const patientData = data["data"];
        if (status === 200) {
          const { _id, patient_id, forename, surname, user_name, address, clinical_notes } = patientData;
          const addressObj = new Address(address["line1"], address["line2"], address["town_city"], address["postcode"]);
          const notesObj = new ClinicalNotes(
            clinical_notes["diagnosis"],
            clinical_notes["notes"],
            clinical_notes["last_accessed"],
            clinical_notes["last_acc_by"],
            clinical_notes["medications"]
          );
          this.patient = new Patient(_id, patient_id, user_name, forename, surname, addressObj, notesObj);
          this.patientFound = true;
        }
      });
    } else {
      this.router.navigateByUrl("/patients-list");
    }
  }

  pushMsgAndRemoveAfterInterval(msg: string) {
    this.messages.push(msg);
    setTimeout(() => {
      this.messages.pop();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.patients$ !== null) {
      this.patients$.unsubscribe();
    }
    this.patientService.patient_idToFind = null;
  }

}
