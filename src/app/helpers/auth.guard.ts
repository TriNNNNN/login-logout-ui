import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserLoginResponse } from '../models/user.model';
import { AuthenticationService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  currentUser: UserLoginResponse;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (typeof this.authenticationService.currentUser === 'undefined') {
      const localData = JSON.parse(localStorage.getItem('currentUser'));
      this.authenticationService.currentUser = localData;
    }
    this.currentUser = this.authenticationService.currentUser;
    if (this.currentUser) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
