import { Component, OnInit } from '@angular/core';

import { User } from '../services/interfaces/user';

import { AuthService } from '../services/auth.service';

import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private loggedIn: boolean;
  private userType: string = null;

  constructor(private authService: AuthService) {
    document.addEventListener('DOMContentLoaded', function () {

      // Get all "navbar-burger" elements
      let $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(function ($el) {
          $el.addEventListener('click', function () {

            // Get the target from the "data-target" attribute
            let target = $el.dataset.target;
            let $target = document.getElementById(target);

            // Toggle the class on both the "navbar-burger" and the "navbar-menu"
            $el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

          });
        });
      }
    });
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getUserType(): string {
    if (this.userType !== null) {
      return this.userType;
    } else {
      return 'none';
    }
  }

  userIsDoctorOrAdmin(): boolean {
    const value = this.getUserType() === 'doctor' || this.getUserType() === 'admin';
    return value;
  }

  logUserOut() {
    this.userType = null;
    this.loggedIn = false;
    this.authService.logout();
  }

  ngOnInit() {
    this.loggedIn = this.authService.getLoggedInAsBool();

    this.authService.isLoggedIn()
      .subscribe((response) => {
        this.loggedIn = response;
        if (this.loggedIn === true && this.userType === null) {
          this.userType = this.authService.getUserType();
          console.log(this.userType);
        }
      });

    // if(this.loggedIn) {
    //   this.get
    // }
  }

}
