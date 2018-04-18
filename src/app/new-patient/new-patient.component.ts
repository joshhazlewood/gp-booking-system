import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { MessagesComponent } from "../messages/messages.component";

import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { PatientService } from "../services/patient.service";

import { Address } from "../models/address";
import { PatientProfile } from "../models/patient-profile";

@Component({
  selector: "app-new-patient",
  styleUrls: ["./new-patient.component.css"],
  templateUrl: "./new-patient.component.html",
})
export class NewPatientComponent implements OnInit {

  public newPatientForm: FormGroup;
  public passwordsForm: FormGroup;
  public errors: string[];

  public messages: string[] = null;
  private patient: PatientProfile = null;

  /* tslint:disable:align*/
  constructor(private patientService: PatientService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private fb: FormBuilder,
    private router: Router) {
    this.createForm();
  }
  /* tslint:enable:align*/

  public ngOnInit() {
    this.messages = [];
    // this.newPatientForm.setValue({
    //   forename: "testOne",
    //   surname: "testOne",
    //   username: "testOne@test.com",
    //   line1: "1b",
    //   line2: "brook road",
    //   townCity: "Manchester",
    //   postcode: "M14 6GG",
    //   password: "",
    //   passwordConfirm: "",
    // });
  }

  public isValid() {
    const valid = this.newPatientForm.valid;
    return valid;
  }

  public removeMsg(index) {
    this.messages.splice(index, 1);
  }

  public createForm() {
    /* tslint:disable:object-literal-sort-keys max-line-length*/
    this.newPatientForm = this.fb.group({
      forename: ["", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(/^\D+$/),
      ]],
      surname: ["", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(/^\D+$/),
      ]],
      username: ["", [
        Validators.required,
        Validators.email,
      ]],
      password: ["", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
      passwordConfirm: ["", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]],
      line1: ["", [
        Validators.required,
        Validators.pattern(/^[\w\-\s]{1,50}$/),
        Validators.minLength(1),
        Validators.maxLength(50),
      ]],
      line2: ["", [
        Validators.required,
        Validators.pattern(/^[\w\-\s]{1,50}$/),
        Validators.minLength(1),
        Validators.maxLength(50),
      ]],
      townCity: ["", [
        Validators.required,
        Validators.pattern(/^[A-z\-\'\s]{1,50}$/),
        Validators.minLength(1),
        Validators.maxLength(50),
      ]],
      postcode: ["", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/),
      ]],
    }, { validator: this.areEqual });
    /* tslint:enable:object-literal-sort-keys max-line-length*/
  }

  public saveDetails() {
    console.log(this.newPatientForm.value);
    const data = this.newPatientForm.value;
    this.patientService.createPatient(data).subscribe(
      (resp: any) => {
        console.log(resp);
        const status = resp.status;
        if (status === 200) {
          const msg = "Patient was saved to the database.";
          this.pushMsgAndRemoveAfterInterval(msg);
        } else if (status.toString().startsWith("4")) {
          const msg = "Error adding patient to the database. Email could already be in use.";
          this.pushMsgAndRemoveAfterInterval(msg);
        }
      },
    );
  }

  public pushMsgAndRemoveAfterInterval(msg: string) {
    this.messages.push(msg);
    setTimeout(() => {
      this.messages.pop();
    }, 3000);
  }

  public updateInputState(input: string) {
    if (this.newPatientForm.controls[input].valid) {
      Object.keys(this.newPatientForm.controls).forEach((key) => {
        this.newPatientForm.controls[key].enable();
      });
    } else {
      Object.keys(this.newPatientForm.controls).forEach((key) => {
        if (key !== input) {
          this.newPatientForm.controls[key].disable();
        }
      });
    }
  }

  private areEqual(group: FormGroup) {
    return group.get("password").value === group.get("passwordConfirm").value ? null : { mismatch: true };
  }

  get forename() { return this.newPatientForm.get("forename"); }

  get surname() { return this.newPatientForm.get("surname"); }

  get username() { return this.newPatientForm.get("username"); }

  get line1() { return this.newPatientForm.get("line1"); }

  get line2() { return this.newPatientForm.get("line2"); }

  get townCity() { return this.newPatientForm.get("townCity"); }

  get postcode() { return this.newPatientForm.get("postcode"); }

  get password() { return this.newPatientForm.get("password"); }

  get passwordConfirm() { return this.newPatientForm.get("passwordConfirm"); }

}
