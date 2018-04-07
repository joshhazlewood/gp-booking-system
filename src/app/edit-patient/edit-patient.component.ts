import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessagesComponent } from '../messages/messages.component';
import { PatientService } from '../services/patient.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PatientProfile } from '../models/patient-profile';
import { Address } from '../models/address';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit, OnDestroy {

  public patientForm: FormGroup;
  public errors: string[];

  private patientToFind: string = null;
  private patient$: any = null;
  private patient: PatientProfile = null;
  public patientFound: boolean = null;
  public isEditable: boolean = null;
  private messages: Array<string> = null;

  constructor(private patientService: PatientService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private fb: FormBuilder,
    private router: Router) {
    this.patientForm = this.fb.group({
      forename: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(/^\D+$/)
      ]],
      surname: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(/^\D+$/)
      ]],
      username: ['', [
        Validators.required,
        Validators.email
      ]],
      line1: ['', [
        Validators.required,
        Validators.pattern(/^[\w\-\s]{1,50}$/),
        Validators.minLength(1),
        Validators.maxLength(50)
      ]],
      line2: ['', [
        Validators.required,
        Validators.pattern(/^[\w\-\s]{1,50}$/),
        Validators.minLength(1),
        Validators.maxLength(50)
      ]],
      townCity: ['', [
        Validators.required,
        Validators.pattern(/^[A-z\-\'\s]{1,50}$/),
        Validators.minLength(1),
        Validators.maxLength(50)
      ]],
      postcode: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/)
      ]]
    });
  }

  ngOnInit() {
    this.patientFound = false;
    this.isEditable = false;
    this.patientToFind = this.activatedRoute.snapshot.params['id'];
    this.getPatientData();
  }

  ngOnDestroy() {
    if (this.patient$ !== null) {
      this.patient$.unsubscribe();
    }
  }

  getPatientData() {
    this.patient$ = this.patientService.getPatientById(this.patientToFind).subscribe(
      (data) => {
        const status = data['status'];
        if (status === 200) {
          this.spinnerService.hide();
          const rawData = data['data'];
          const addressData = rawData['address'];
          const address = new Address(
            addressData.line1,
            addressData.line2,
            addressData.town_city,
            addressData.postcode
          );
          this.patient = new PatientProfile(
            rawData._id,
            rawData.patient_id,
            rawData.forename,
            rawData.surname,
            rawData.user_name,
            address
          );
          this.patientFound = true;
        }
      },
      (err) => {
        this.spinnerService.hide();
        console.log(err);
      });
  }

  makeEditable() {
    this.messages = [];
    this.isEditable = true;
  }

  cancelEdit() {
    this.messages = [];
    this.getPatientData();
    Object.keys(this.patientForm.controls).forEach(key => {
      this.patientForm.controls[key].enable();
    });
    this.isEditable = false;
  }

  updateInputState(input: string) {
    if (this.patientForm.controls[input].valid) {
      Object.keys(this.patientForm.controls).forEach(key => {
        this.patientForm.controls[key].enable();
      });
    } else {
      Object.keys(this.patientForm.controls).forEach(key => {
        if (key !== input) {
          this.patientForm.controls[key].disable();
        }
      });
    }
  }

  saveDetails() {
    console.log(this.patient);
    this.patientService.savePatientById(this.patientToFind, this.patient).subscribe(
      (data) => {
        const status: number = data['status'];
        console.log(status);
        if (status === 200) {
          this.isEditable = false;
          const msg = 'Patient data was successfully updated.';
          this.pushMsgAndRemoveAfterInterval(msg);
        } else if (status.toString().startsWith('4')) {
          const msg = 'Server Error';
          this.pushMsgAndRemoveAfterInterval(msg);
        }
      },
      (err) => {
        console.log('error');
        const msg = 'Error updating patient data.';
        this.pushMsgAndRemoveAfterInterval(msg);
      }
    );
  }

  pushMsgAndRemoveAfterInterval(msg: string) {
    this.messages.push(msg);
    setTimeout(() => {
      this.messages.pop();
    }, 3000);
  }

  isEditableAndValid() {
    const value = this.isEditable && this.patientForm.valid;
    return value;
  }

  removeMsg(index) {
    this.messages.splice(index, 1);
  }

  get forename() { return this.patientForm.get('forename'); }

  get surname() { return this.patientForm.get('surname'); }

  get username() { return this.patientForm.get('username'); }

  get line1() { return this.patientForm.get('line1'); }

  get line2() { return this.patientForm.get('line2'); }

  get townCity() { return this.patientForm.get('townCity'); }

  get postcode() { return this.patientForm.get('postcode'); }

}
