import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import * as jwtDecode from "jwt-decode";
import * as moment from "moment";

import { AuthService } from "../../services/auth.service";
import { User } from "../../services/interfaces/user";

@Component({
  selector: "app-login",
  styleUrls: ["./login.component.css"],
  templateUrl: "./login.component.html",
})
export class LoginComponent {

  public loginForm: FormGroup;
  public errors: string[];
  private user: User;
  private userType: string;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ["", [
        Validators.required,
        Validators.email,
      ]],
      password: ["", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ]],
      userType: ["", Validators.required],
    });
    this.errors = [];
  }

  public isFormValidAndTouched(): boolean {
    return this.loginForm.valid && this.loginForm.touched;
  }

  public login() {
    this.errors = [];
    const val = this.loginForm.value;
    this.userType = val.userType;

    if (this.loginForm.valid) {
      this.authService.login(val.email, val.password, val.userType)
        .subscribe(
          (data) => {
            const status = data["status"];
            if (status === 200) {
              this.setSession(data["data"]);
              if (val.userType === "patient") {
                this.router.navigateByUrl("/new-appointment");
              } else {
                this.router.navigateByUrl("/appointments-list");
              }
            } else if (status.toString().startsWith(4)) {
              const error = "Incorrect username or password";
              this.errors.push(error);
            }
          });
    }
  }

  public setSession(authResult) {
    const expiresAt = moment()
      .add(authResult.expires_in, "s")
      .format("YYYY-MM-DD HH:mm:ss");
    const decodedToken = jwtDecode(authResult.id_token);
    const parsedToken = JSON.parse(decodedToken.data);
    const user_id = parsedToken.user_id;
    // this.user = 
    // this.user = {
    //   user_id: parsedToken.user_id,
    //   user_name: parsedToken.user_name,
    //   user_role: parsedToken.user_role
    // }

    localStorage.setItem("id_token", authResult.id_token);
    localStorage.setItem("expires_at", expiresAt);
    this.getDetailsAndSetUser(user_id);
  }

  private getDetailsAndSetUser(userId: string) {
    if (this.userType === "patient") {
      const res = this.http.get(`/api/patients/user-data/${userId}`)
        .subscribe(res => {
          const userData = res["data"];
          this.user = {
            user_id: userData._id,
            user_name: userData.user_name,
            user_role: "patient",
          };

          this.authService.setUser(this.user);
        });
    } else if (this.userType === "staff") {
      const res = this.http.get(`/api/staff/user-data/${userId}`)
        .subscribe(res => {
          const userData = res["data"];
          this.user = {
            user_id: userData._id,
            user_name: userData.user_name,
            user_role: userData.staff_role,
          };
          this.authService.setUser(this.user);
        });
    }
  }

}
