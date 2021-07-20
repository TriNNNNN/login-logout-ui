export interface UserLoginResponse {
  status: number;
  message: string;
  data?: {
    _id: string;
    email: string;
    mobileNo: string;
    name: string;
    loginOnDate: string;
    accessToken: string;
    value: boolean;
  };
  error?: object | string;
}

export interface UserMobileVerifyRequest {
  mobileNo: string;
  code: string;
}
export interface UserMobileVerifyResponse {
  data: object | string;
  error: object | string;
  value: boolean;
}

export interface VerifyMobileModalData {
  mobileNo: string;
}

export interface UserRegisterRequest {
  email: string;
  mobileNo: string;
  password: string;
  name: string;
  countryCode: string;
  dob: string;
  referalCode: string;
  affiliateCode: string;
}
