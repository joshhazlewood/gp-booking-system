import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppointmentsService } from '../services/appointments.service';

@Component({
  selector: 'app-confirm-app',
  templateUrl: './confirm-app.component.html',
  styleUrls: ['./confirm-app.component.css']
})
export class ConfirmAppComponent implements OnInit {

  private confirmationData = null;
  private dataFound = false;

  constructor(private router: Router,
    private authService: AuthService,
    private appointmentsService: AppointmentsService
  ) { }

  ngOnInit() {
    const data = this.appointmentsService.confirmationData;
    if(!this.isEmptyObject(data)) {
      this.confirmationData = this.appointmentsService.confirmationData;
      this.dataFound = true;
    }
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }

  logout() {
    this.authService.logout();
  }
}
