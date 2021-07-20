import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserLoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser: UserLoginResponse;
  currentUserSubject: Subject<UserLoginResponse> =
    new Subject<UserLoginResponse>();

  constructor(private http: HttpClient) {}

  login(userName: string, password: string, countryCode: string) {
    return this.http
      .post<any>(`https://testapiusermanagemet.fairplay.club/V2/user/login`, {
        userName,
        password,
        countryCode,
      })
      .pipe(
        map((user) => {
          if (user && user.status === 200) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;
            this.currentUserSubject.next(user);
          }
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next();
  }
}
