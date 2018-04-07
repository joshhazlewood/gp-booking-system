import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StaffService } from '../services/staff.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { StaffProfile } from '../models/staff-profile';

@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.css']
})
export class EditStaffComponent implements OnInit, OnDestroy {

  public staffForm: FormGroup;
  public errors: string[];

  private staffToFind: string = null;
  private staffMember$: any = null;
  private staffMember: StaffProfile = null;
  public staffMemberFound: boolean = null;
  public isEditable: boolean = null;
  private messages: string[] = null;
  public roles = ['doctor', 'admin'];

  constructor(private staffService: StaffService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private fb: FormBuilder,
    private router: Router) {
    this.staffForm = this.fb.group({
      forename: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern(/^\D+$/)
      ]],
      surname: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(/^\D+$/)
      ]],
      username: ['', [
        Validators.required,
        Validators.email
      ]],
      staff_role: ['', [
        Validators.required
      ]]
    });
  }

  ngOnInit() {
    this.staffMemberFound = false;
    this.spinnerService.show();
    this.isEditable = false;
    this.staffToFind = this.activatedRoute.snapshot.params['id'];
    this.getStaffData();
  }

  getStaffData() {
    console.log(this.staffToFind);
    this.staffMember$ = this.staffService.getStaffById(this.staffToFind).subscribe(
      (data) => {
        const status = data['status'];
        if (status === 200) {
          this.spinnerService.hide();
          const rawData = data['data'];
          console.log(rawData);

          this.staffMember = new StaffProfile(
            rawData._id,
            rawData.staff_role,
            rawData.forename,
            rawData.surname,
            rawData.user_name
          );
          this.staffMemberFound = true;
          console.log('here');
        }
      },
      (err) => {
        this.spinnerService.hide();
        console.log(err);
      });
  }

  saveStaffData() {
    this.staffService.saveStaffById(this.staffToFind, this.staffMember).subscribe(
      (data) => {
        const status = data['status'];
        if (status === 200) {
          this.isEditable = false;
          this.messages.push('Staff member data was successfully updated.');
        }
      },
      (err) => {
        this.messages.push('Error updating staff member data.');
      }
    );
  }

  makeEditable() {
    this.messages = [];
    this.isEditable = true;
  }

  cancelEdit() {
    this.messages = [];
    this.getStaffData();
    Object.keys(this.staffForm.controls).forEach(key => {
      this.staffForm.controls[key].enable();
    });
    this.isEditable = false;
  }

  removeMsg(index) {
    this.messages.splice(index, 1);
  }

  isEditableAndValid() {
    const value = this.isEditable && this.staffForm.valid;
    return value;
  }

  get forename() { return this.staffForm.get('forename'); }

  get surname() { return this.staffForm.get('surname'); }

  get username() { return this.staffForm.get('username'); }

  get user_role() { return this.staffForm.get('user_role'); }

  ngOnDestroy() {
    this.staffMember$.unsubscribe();
  }

}
