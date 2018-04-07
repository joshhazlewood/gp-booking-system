import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessagesComponent } from '../messages/messages.component';

import { PatientService } from '../services/patient.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { PatientProfile } from '../models/patient-profile';
import { Address } from '../models/address';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.css']
})
export class NewPatientComponent implements OnInit {

  public newPatientForm: FormGroup;
  public passwordsForm: FormGroup;
  public errors: string[];

  private patient: PatientProfile = null;
  public messages: Array<string> = null;

  constructor(private patientService: PatientService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private fb: FormBuilder,
    private router: Router) {
    this.createForm();
  }

  ngOnInit() {
    this.messages = [];
    this.newPatientForm.setValue({
      forename: 'testOne',
      surname: 'testOne',
      username: 'testOne@test.com',
      line1: '1b',
      line2: 'brook road',
      townCity: 'Manchester',
      postcode: 'M14 6GG',
      password: '',
      passwordConfirm: '',
    });
  }

  isValid() {
    const valid = this.newPatientForm.valid;
    return valid;
  }

  removeMsg(index) {
    this.messages.splice(index, 1);
  }

  createForm() {

    this.newPatientForm = this.fb.group({
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
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]],
      passwordConfirm: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
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
    }, { validator: this.areEqual });
  }

  private areEqual(group: FormGroup) {
    return group.get('password').value === group.get('passwordConfirm').value ? null : { mismatch: true };
  }

  saveDetails() {
    console.log(this.newPatientForm.value);
    const data = this.newPatientForm.value;
    this.patientService.createPatient(data).subscribe(
      (resp) => {
        console.log(resp);
        const status = resp['status'];
        if (status === 200) {
          const msg = 'Patient was saved to the database.';
          this.pushMsgAndRemoveAfterInterval(msg);
        } else if (status.toString().startsWith('4')) {
          const msg = 'Error adding patient to the database. Email could already be in use.';
          this.pushMsgAndRemoveAfterInterval(msg);
        }
      }
    );
  }

  pushMsgAndRemoveAfterInterval(msg: string) {
    this.messages.push(msg);
    setTimeout(() => {
      this.messages.pop();
    }, 3000);
  }

  updateInputState(input: string) {
    if (this.newPatientForm.controls[input].valid) {
      Object.keys(this.newPatientForm.controls).forEach(key => {
        this.newPatientForm.controls[key].enable();
      });
    } else {
      Object.keys(this.newPatientForm.controls).forEach(key => {
        if (key !== input) {
          this.newPatientForm.controls[key].disable();
        }
      });
    }
  }

  get forename() { return this.newPatientForm.get('forename'); }

  get surname() { return this.newPatientForm.get('surname'); }

  get username() { return this.newPatientForm.get('username'); }

  get line1() { return this.newPatientForm.get('line1'); }

  get line2() { return this.newPatientForm.get('line2'); }

  get townCity() { return this.newPatientForm.get('townCity'); }

  get postcode() { return this.newPatientForm.get('postcode'); }

  get password() { return this.newPatientForm.get('password'); }

  get passwordConfirm() { return this.newPatientForm.get('passwordConfirm'); }

}
