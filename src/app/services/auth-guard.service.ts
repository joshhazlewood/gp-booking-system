import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;

    let loggedIn = this.authService.getLoggedInAsBool();

    if (loggedIn === false) {
      this.router.navigateByUrl('/login');
      return false;
    } else {
      const userType = this.authService.getUserType();

      if (userType === undefined) {
        console.log('undefined here');
        this.router.navigateByUrl('/home');
        return false;
      } else if (expectedRole === 'doctor' && (userType === 'admin' || userType === 'admin' )) {
        console.log('doc or admin');
        return true;
      } else if (userType !== expectedRole ) {
        this.router.navigateByUrl('/home');
        return false;
      }
    }
    return true;
  }
}
