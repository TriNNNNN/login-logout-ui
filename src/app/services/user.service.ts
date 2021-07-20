import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  UserMobileVerifyRequest,
  UserRegisterRequest,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  verifyMobile(verifyMobileReq: UserMobileVerifyRequest) {
    return this.http.post(
      `https://testapiusermanagemet.fairplay.club/User/verifyMobile`,
      {
        mobileNo: verifyMobileReq.mobileNo,
        code: verifyMobileReq.code,
      }
    );
  }

  register(registerReq: UserRegisterRequest) {
    return this.http.post(
      `https://testapiusermanagemet.fairplay.club/v2/user/signup`,
      registerReq
    );
  }
}
