import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StaffService } from '../services/staff.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { StaffProfile } from '../models/staff-profile';
import { Address } from '../models/address';

@Component({
  selector: 'app-new-staff',
  templateUrl: './new-staff.component.html',
  styleUrls: ['./new-staff.component.css']
})
export class NewStaffComponent implements OnInit {

  public newStaffForm: FormGroup;
  public errors: string[];

  private staff: StaffProfile = null;
  public messages: string[] = null;
  public roles = ['admin', 'doctor'];

  constructor(private staffService: StaffService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private fb: FormBuilder,
    private router: Router) {
    this.createForm();
  }

  ngOnInit() {
    this.messages = [];
  }

  createForm() {
    this.newStaffForm = this.fb.group({
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
      staff_role: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]],
      passwordConfirm: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]]
    }, { validator: this.areEqual });
  }

  private areEqual(group: FormGroup) {
    return group.get('password').value === group.get('passwordConfirm').value ? null : { mismatch: true };
  }

  isValid() {
    const valid = this.newStaffForm.valid;
    return valid;
  }

  removeMsg(index) {
    this.messages.splice(index, 1);
  }

  saveDetails() {
    console.log(this.newStaffForm.value);
    const data = this.newStaffForm.value;
    this.staffService.createStaff(data).subscribe(
      (resp) => {
        console.log(resp);
        const status = resp['status'];
        if (status === 200) {
          this.messages.push('Staff member was saved to the database.');
        } else if (status.toString().startsWith('4')) {
          this.messages.push('Error adding staff member to the database. This is most likey because the email is already in use.');
        }
      }
    );
  }

  updateInputState(input: string) {
    if (this.newStaffForm.controls[input].valid) {
      Object.keys(this.newStaffForm.controls).forEach(key => {
        this.newStaffForm.controls[key].enable();
      });
    } else {
      Object.keys(this.newStaffForm.controls).forEach(key => {
        if (key !== input) {
          this.newStaffForm.controls[key].disable();
        }
      });
    }
  }

  get forename() { return this.newStaffForm.get('forename'); }

  get surname() { return this.newStaffForm.get('surname'); }

  get username() { return this.newStaffForm.get('username'); }

  get staff_role() { return this.newStaffForm.get('staff_role'); }

  get password() { return this.newStaffForm.get('password'); }

  get passwordConfirm() { return this.newStaffForm.get('passwordConfirm'); }
}
