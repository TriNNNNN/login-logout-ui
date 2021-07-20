import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';

import { AuthenticationService, SnackBarService } from '../services';
import { VerifyMobileComponent } from '../verify-mobile/verify-mobile.component';
import { VerifyMobileModalData } from '../models/user.model';
import { Subject } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Subject<boolean> = this.loader.isLoading;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private snackBService: SnackBarService,
    private loader: LoaderService
  ) {
    // redirect to home if already logged in
    this.authenticationService.currentUserSubject.subscribe((data) => {
      if (data) this.router.navigate(['/home']);
    });

    this.loginForm = this.formBuilder.group({
      inputUserName: ['', [Validators.required]],
      inputPassword: ['', [Validators.required]],
      inputCountryCode: [
        '',
        [Validators.required, Validators.pattern('^[+][0-9]*$')],
      ],
    });
  }

  ngOnInit(): void {}

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.makeLoginCall();
  }

  makeLoginCall(): void {
    this.authenticationService
      .login(
        this.f.inputUserName.value,
        this.f.inputPassword.value,
        this.f.inputCountryCode.value
      )
      .pipe(first())
      .subscribe(
        (user) => {
          this.snackBService.openSnackBar(`Welcome ${user?.data?.name}`, true);
          this.router.navigate(['/']);
        },
        (error) => {
          if (error.error.error?.verifyUser) {
            this.openDialog(error.error.error?.user);
          } else {
            this.snackBService.openSnackBar(
              `Incorrect Username or Password !!!`,
              false
            );
          }
        }
      );
  }

  get f() {
    return this.loginForm.controls;
  }

  openDialog(userMobileData: VerifyMobileModalData): void {
    const dialogRef = this.dialog.open(VerifyMobileComponent, {
      disableClose: true,
      width: '400px',
      data: {
        mobileNo: userMobileData.mobileNo,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.makeLoginCall();
    });
  }
}
