import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { MessagesComponent } from "../messages/messages.component";
import { StaffService } from "../services/staff.service";

import { Address } from "../models/address";
import { StaffProfile } from "../models/staff-profile";

@Component({
  selector: "app-new-staff",
  styleUrls: ["./new-staff.component.css"],
  templateUrl: "./new-staff.component.html",
})
export class NewStaffComponent implements OnInit {

  public newStaffForm: FormGroup;
  public errors: string[];

  public messages: string[] = null;
  public roles = ["admin", "doctor"];
  private staff: StaffProfile = null;

  /* tslint:disable:align*/
  constructor(private staffService: StaffService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private fb: FormBuilder,
    private router: Router) {
    this.createForm();
  }
  /* tslint:enable:align*/

  public ngOnInit() {
    this.messages = [];
  }

  /* tslint:disable:object-literal-sort-keys*/
  public createForm() {
    this.newStaffForm = this.fb.group({
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
      staff_role: ["", Validators.required],
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
    }, { validator: this.areEqual });
  }
  /* tslint:enable:object-literal-sort-keys*/

  public isValid() {
    const valid = this.newStaffForm.valid;
    return valid;
  }

  /* tslint:disable:max-line-length*/
  public saveDetails() {
    console.log(this.newStaffForm.value);
    const data = this.newStaffForm.value;
    this.staffService.createStaff(data).subscribe(
      (resp: any) => {
        console.log(resp);
        const status = resp.status;
        if (status === 200) {
          const msg = "Staff member was saved to the database.";
          this.pushMsgAndRemoveAfterInterval(msg);
        } else if (status.toString().startsWith("4")) {
          const msg = "Error adding staff member to the database. This is most likey because the email is already in use.";
          this.pushMsgAndRemoveAfterInterval(msg);
        }
      },
    );
  }
  /* tslint:enable:max-line-length*/

  public pushMsgAndRemoveAfterInterval(msg: string) {
    this.messages.push(msg);
    setTimeout(() => {
      this.messages.pop();
    }, 3000);
  }

  public updateInputState(input: string) {
    if (this.newStaffForm.controls[input].valid) {
      Object.keys(this.newStaffForm.controls).forEach((key) => {
        this.newStaffForm.controls[key].enable();
      });
    } else {
      Object.keys(this.newStaffForm.controls).forEach((key) => {
        if (key !== input) {
          this.newStaffForm.controls[key].disable();
        }
      });
    }
  }

  private areEqual(group: FormGroup) {
    return group.get("password").value === group.get("passwordConfirm").value ? null : { mismatch: true };
  }

  get forename() { return this.newStaffForm.get("forename"); }

  get surname() { return this.newStaffForm.get("surname"); }

  get username() { return this.newStaffForm.get("username"); }

  get staff_role() { return this.newStaffForm.get("staff_role"); }

  get password() { return this.newStaffForm.get("password"); }

  get passwordConfirm() { return this.newStaffForm.get("passwordConfirm"); }
}
