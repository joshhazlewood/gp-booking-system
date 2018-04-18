import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";

import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;

    const loggedIn = this.authService.getLoggedInAsBool();

    if (loggedIn === false) {
      this.router.navigateByUrl("/login");
      return false;
    } else {
      const userType = this.authService.getUserType();

      if (userType === undefined) {
        this.router.navigateByUrl("/home");
        return false;
      } else if (expectedRole === "doctor" && (userType === "admin" || userType === "admin" )) {
        return true;
      } else if (userType !== expectedRole ) {
        this.router.navigateByUrl("/home");
        return false;
      }
    }
    return true;
  }
}
