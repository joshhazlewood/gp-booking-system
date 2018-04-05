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
        Validators.required
      ]],
      surname: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ]],
      username: ['', [
        Validators.required,
        Validators.email
      ]],
      user_role: ['', [
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

  ngOnDestroy() {

  }

}
