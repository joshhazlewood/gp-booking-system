import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errors: string[];

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
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

    if (this.loginForm.valid) {

      if (val.userType === 'patient') {
        this.authService.login(val.email, val.password, val.userType)
          .subscribe(
            (data) => {
              let status = data['status'];
              if (status === 200) {
                console.log('Logged in');
                this.router.navigateByUrl('/new-appointment');
              } else if (status.toString().startsWith(4)) {
                let error = 'Incorrect username or password';
                console.log(error);
                this.errors.push(error);
              }
            }
          );
      } else if (val.userType === 'staff') {
        //  COMPLETE THIS FOR STAFF
      }
    }
  }

  isFormValidAndTouched(): boolean {
    return this.loginForm.valid && this.loginForm.touched;
  }

  ngOnInit() {
  }

}
