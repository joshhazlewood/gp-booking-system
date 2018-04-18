import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppointmentsService } from "../services/appointments.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-confirm-app",
  styleUrls: ["./confirm-app.component.css"],
  templateUrl: "./confirm-app.component.html",
})
export class ConfirmAppComponent implements OnInit {

  public dataFound = false;
  private confirmationData = null;

  constructor(private router: Router,
              private authService: AuthService,
              private appointmentsService: AppointmentsService,
  ) { }

  public ngOnInit() {
    const data = this.appointmentsService.confirmationData;
    if (!this.isEmptyObject(data)) {
      this.confirmationData = this.appointmentsService.confirmationData;
      this.dataFound = true;
    }
  }

  public isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  public goToHome() {
    this.router.navigateByUrl("/home");
  }

  public logout() {
    this.authService.logout();
  }
}
