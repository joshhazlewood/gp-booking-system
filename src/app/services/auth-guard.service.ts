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

    if (!loggedIn) {
      this.router.navigateByUrl('/login');
      return false;
    } else {
      const user = this.authService.getUser();
      if (user.user_role !== expectedRole) {
        //  REDIRECT TO FORBIDDEN PAGE
        return false;
      }
    }
    return true;
  }
}
