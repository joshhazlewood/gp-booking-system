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

  form: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2)
      ]]
    })
  }

  login() {
    const val = this.form.value;

    if (val.email && val.password) {
      // this.authService.login(val.email && val.password)
      // .subscribe(
      //   () => {
      //     console.log('User is logged in');
      //     this.router.navigateByUrl('/home');
      //   }
      // );
    }
  }

  ngOnInit() {
  }

}
