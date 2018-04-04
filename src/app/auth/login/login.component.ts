import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';
import * as jwtDecode from 'jwt-decode';

import { AuthService } from '../../services/auth.service';
import { User } from '../../services/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errors: string[];
  user: User;
  userType: string;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ]],
      userType: ['', Validators.required]
    });
    this.errors = [];
  }

  login() {
    this.errors = [];
    const val = this.loginForm.value;
    this.userType = val.userType;

    if (this.loginForm.valid) {
      this.authService.login(val.email, val.password, val.userType)
        .subscribe(
          (data) => {
            let status = data['status'];
            console.log(status);
            console.log(status.toString().startsWith(4));
            if (status === 200) {
              this.setSession(data['data']);
              // const user = this.authService.getUser();
              if (val.userType === 'patient') {
                this.router.navigateByUrl('/new-appointment');
              } else {
                console.log(status);
                this.router.navigateByUrl('/appointments-list');
              }
            } else if (status.toString().startsWith(4)) {
              console.log('error should be shown');
              let error = 'Incorrect username or password';
              this.errors.push(error);
            }
          },
          (err) => {
            console.log(err);
          },
          () => {
            // if (val.userType === 'patient') {
            //   this.router.navigateByUrl('/new-appointment');
            // } else {
            //   this.router.navigateByUrl('/staff-list');
            // }
          });
    }
  }

  public setSession(authResult) {
    const expiresAt = moment()
      .add(authResult.expires_in, 's')
      .format('YYYY-MM-DD HH:mm:ss');
    const decodedToken = jwtDecode(authResult.id_token);
    const parsedToken = JSON.parse(decodedToken.data);
    const user_id = parsedToken.user_id;
    // this.user = 
    // this.user = {
    //   user_id: parsedToken.user_id,
    //   user_name: parsedToken.user_name,
    //   user_role: parsedToken.user_role
    // }

    localStorage.setItem('id_token', authResult.id_token);
    localStorage.setItem('expires_at', expiresAt);
    this.getDetailsAndSetUser(user_id);
  }

  private getDetailsAndSetUser(user_id: string) {
    if (this.userType === 'patient') {
      const res = this.http.get(`/api/patients/user-data/${user_id}`)
        .subscribe(res => {
          const userData = res['data'];
          this.user = {
            user_id: userData._id,
            user_name: userData.user_name,
            user_role: 'patient'
          };

          this.authService.setUser(this.user);
        });
    } else if (this.userType === 'staff') {
      const res = this.http.get(`/api/staff/user-data/${user_id}`)
        .subscribe(res => {
          const userData = res['data'];
          console.log(userData);
          this.user = {
            user_id: userData._id,
            user_name: userData.user_name,
            user_role: userData.staff_role
          };
          this.authService.setUser(this.user);
        });
    }
  }

  isFormValidAndTouched(): boolean {
    return this.loginForm.valid && this.loginForm.touched;
  }

  ngOnInit() {
  }

}
