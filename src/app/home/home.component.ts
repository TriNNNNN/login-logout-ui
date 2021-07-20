import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginResponse } from '../models/user.model';
import { AuthenticationService } from '../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  currentUser: UserLoginResponse;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.currentUser = this.authenticationService.currentUser;
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
