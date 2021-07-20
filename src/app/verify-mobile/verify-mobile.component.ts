import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { VerifyMobileModalData } from '../models/user.model';
import { UserService } from '../services';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.component.html',
  styleUrls: ['./verify-mobile.component.scss'],
})
export class VerifyMobileComponent implements OnInit {
  verifyMobileForm: FormGroup;
  isLoading$: Subject<boolean> = this.loader.isLoading;

  constructor(
    public dialogRef: MatDialogRef<VerifyMobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerifyMobileModalData,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private loader: LoaderService
  ) {
    this.verifyMobileForm = this.formBuilder.group({
      inputMobileNo: [
        data.mobileNo,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      inputVerificationCode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });
    this.verifyMobileForm.controls['inputMobileNo'].disable();
  }

  ngOnInit(): void {}

  verifyMobileNo() {
    if (this.verifyMobileForm.invalid) {
      return;
    }
    this.userService
      .verifyMobile({
        mobileNo: this.f.inputMobileNo.value,
        code: this.f.inputVerificationCode.value,
      })
      .pipe(first())
      .subscribe(
        (verifyMobileResp: any) => {
          if (verifyMobileResp.value) {
            this.dialogRef.close();
            this.router.navigate(['/home']);
          } else {
            this.verifyMobileForm.controls.inputVerificationCode.setErrors({
              invalidVerificationCode: true,
            });
          }
        },
        (error) => {
          console.log('verifyMobileResp--Error->', error.error);
        }
      );
  }

  get f() {
    return this.verifyMobileForm.controls;
  }
}
