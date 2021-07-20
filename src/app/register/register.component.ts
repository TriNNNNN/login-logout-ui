import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {
  AuthenticationService,
  SnackBarService,
  UserService,
} from '../services';
import { LoaderService } from '../services/loader.service';

import * as moment from 'moment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  isLoading$: Subject<boolean> = this.loader.isLoading;
  registerForm: FormGroup;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private loader: LoaderService
  ) {
    // redirect to home if already logged in
    this.authenticationService.currentUserSubject.subscribe((data) => {
      if (data) this.router.navigate(['/home']);
    });

    this.registerForm = this.formBuilder.group(
      {
        inputName: ['', [Validators.required]],
        inputEmail: ['', [Validators.required, Validators.email]],
        inputMobileNo: [
          '',
          [Validators.required, Validators.pattern('^[0-9]*$')],
        ],
        inputPassword: ['', [Validators.required, Validators.minLength(6)]],
        inputConfirmPassword: ['', [Validators.required]],
        inputCountryCode: [
          '',
          [Validators.required, Validators.pattern('^[+][0-9]*$')],
        ],
        inputDob: ['', [Validators.required]],
        inputReferalCode: ['', [Validators.required]],
        inputAffiliateCode: ['', [Validators.required]],
      },
      {
        validators: this.checkIfMatchingPasswords(
          'inputPassword',
          'inputConfirmPassword'
        ),
      }
    );
  }

  ngOnInit(): void {}

  get f() {
    return this.registerForm.controls;
  }

  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  signUp() {
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.userService
      .register({
        email: this.f.inputEmail.value,
        mobileNo: this.f.inputMobileNo.value,
        password: this.f.inputPassword.value,
        name: this.f.inputName.value,
        countryCode: this.f.inputCountryCode.value,
        dob: moment(this.f.inputDob.value).format('YYYY-MM-DD'),
        referalCode: this.f.inputReferalCode.value,
        affiliateCode: this.f.inputAffiliateCode.value,
      })
      .pipe(first())
      .subscribe(
        (data) => {
          this.snackBarService.openSnackBar(
            `User Registered successfully!! Please Sign in to continue`,
            true
          );
          this.router.navigate(['/login']);
        },
        (error) => {
          this.snackBarService.openSnackBar(
            `Error Occured ! Email / Mobile no. already exists`,
            false
          );
          this.registerForm.controls['inputEmail'].setErrors({
            alreadyExists: true,
          });
          this.registerForm.controls['inputMobileNo'].setErrors({
            alreadyExists: true,
          });
        }
      );
  }
}
