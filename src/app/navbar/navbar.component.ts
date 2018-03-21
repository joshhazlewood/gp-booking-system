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
    const user = this.authService.getUser();
    if (user !== null) {
      return user.user_role;
    }
    return 'none';
  }

  userIsDoctorOrAdmin(): boolean {
    const value = this.getUserType() === 'doctor' || this.getUserType() === 'admin'
    return value;
  }

  logUserOut() {
    console.log('logging out');
    this.authService.logout();
  }

  ngOnInit() {
    this.authService.isLoggedIn()
      .subscribe((response) => {
        this.loggedIn = response;
      });
  }

}
