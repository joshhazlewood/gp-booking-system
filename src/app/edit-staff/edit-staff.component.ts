import { Component, OnDestroy, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { MessagesComponent } from "../messages/messages.component";

import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { StaffProfile } from "../models/staff-profile";
import { StaffService } from "../services/staff.service";

@Component({
  selector: "app-edit-staff",
  styleUrls: ["./edit-staff.component.css"],
  templateUrl: "./edit-staff.component.html",
})
export class EditStaffComponent implements OnInit, OnDestroy {

  public staffForm: FormGroup;
  public errors: string[];
  public staffMemberFound: boolean = null;
  public isEditable: boolean = null;
  public roles = ["doctor", "admin"];

  private staffToFind: string = null;
  private staffMember$: any = null;
  private staffMember: StaffProfile = null;
  private messages: string[] = null;

  /* tslint:disable:object-literal-sort-keys */
  /* tslint:disable:max-line-length */
  /* tslint:disable:align */
  constructor(private staffService: StaffService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private fb: FormBuilder,
    private router: Router) {
    this.staffForm = this.fb.group({
      forename: ["", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(/^\D+$/),
      ]],
      surname: ["", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(/^\D+$/),
      ]],
      username: ["", [
        Validators.required,
        Validators.email,
      ]],
      staff_role: ["", [
        Validators.required,
      ]],
    });
  }
  /* tslint:enable:object-literal-sort-keys */
  /* tslint:enable:max-line-length */
  /* tslint:enable:align */

  public ngOnInit() {
    this.staffMemberFound = false;
    this.spinnerService.show();
    this.isEditable = false;
    this.staffToFind = this.activatedRoute.snapshot.params.id;
    this.getStaffData();
  }

  public getStaffData() {
    console.log(this.staffToFind);
    this.staffMember$ = this.staffService.getStaffById(this.staffToFind).subscribe(
      (data: any) => {
        const status = data.status;
        if (status === 200) {
          this.spinnerService.hide();
          const rawData = data.data;
          console.log(rawData);

          this.staffMember = new StaffProfile(
            rawData._id,
            rawData.staff_role,
            rawData.forename,
            rawData.surname,
            rawData.user_name,
          );
          this.staffMemberFound = true;
        }
      },
      (err) => {
        this.spinnerService.hide();
        console.log(err);
      });
  }

  public saveStaffData() {
    this.staffService.saveStaffById(this.staffToFind, this.staffMember).subscribe(
      (data: any) => {
        const status = data.status;
        if (status === 200) {
          this.isEditable = false;
          const msg = "Staff member data was successfully updated.";
          this.pushMsgAndRemoveAfterInterval(msg);

        }
      },
      (err) => {
        const msg = "Error updating staff member data.";
        this.pushMsgAndRemoveAfterInterval(msg);
      },
    );
  }

  public pushMsgAndRemoveAfterInterval(msg: string) {
    this.messages.push(msg);
    setTimeout(() => {
      this.messages.pop();
    }, 3000);
  }

  public makeEditable() {
    this.messages = [];
    this.isEditable = true;
  }

  public cancelEdit() {
    this.messages = [];
    this.getStaffData();
    Object.keys(this.staffForm.controls).forEach((key) => {
      this.staffForm.controls[key].enable();
    });
    this.isEditable = false;
  }

  public removeMsg(index) {
    this.messages.splice(index, 1);
  }

  public isEditableAndValid() {
    const value = this.isEditable && this.staffForm.valid;
    return value;
  }

  get forename() { return this.staffForm.get("forename"); }

  get surname() { return this.staffForm.get("surname"); }

  get username() { return this.staffForm.get("username"); }

  get staff_role() { return this.staffForm.get("staff_role"); }

  public ngOnDestroy() {
    this.staffMember$.unsubscribe();
  }

}
