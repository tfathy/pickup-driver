/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserModel } from '../shared/models/user-model';
import { Storage } from '@capacitor/storage';
import { UserResponseData } from '../shared/models/user-response-data';
interface AuthResponseData {
  token: string;
  email: string;
  refreshToken: string;
  expires: string;
  userId: string;
  accountStatus: string;
  userType?: string;
  registered?: boolean;
  driverNameEn?: string;
  driverNameAr?: string;
  terminatedFlag?: string;
  driverId?: number;
  spId?: number;
  spNameAr?: string;
  spNameEn?: string;
  spContactPersonEmail?: string;
  teamDescEn?: string;
  teamId?: number;
  vclId?: number;
  vclDescEn?: string;
  vclCode?: string;
  vclSizeDescEn?: string;
  vclSizeDescAr?: string;
  vclSizeId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<UserModel>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  authLogin(loginEmail: string, loginPassword: string) {
    console.log('**********authLogin start**************');
    console.log(
      `${environment.backEndApiRoot}/driver-security-app/driver-auth/login`
    );
    console.log('loginEmail', loginEmail);
    console.log('loginPassword', loginPassword);
    return this.http.post<any>(
        `${environment.backEndApiRoot}/driver-security-app/driver-auth/login`,
        {
          email: loginEmail,
          password: loginPassword,
        },
        { observe: 'response' }
      )
      .pipe(
        tap((res) => {
          console.log('res',res);
          this.setUserData(res);
        })
      );
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Storage.remove({ key: 'DriverAuthData' });
    this.router.navigate(['/']);
  }

  loadUserInfo(token: string, userId: string): Observable<UserResponseData> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    console.log(
      `${environment.backEndApiRoot}/driver-security-app/driver-auth/${userId}`
    );
    return this.http.get<UserResponseData>(
      `${environment.backEndApiRoot}/driver-security-app/driver-auth/${userId}`,
      { headers: headerInfo }
    );
  }

  autoLogin() {
    return from(Storage.get({ key: 'DriverAuthData' })).pipe(
      map((storedDate) => {
        if (!storedDate || !storedDate.value) {
          console.log('******** cannot find storage DriverAuthData***** ');
          return null;
        }
        const parsData = JSON.parse(storedDate.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
          fullNameEn: string;
          fullNameAr: string;
          userType: string;
          accountStatus: string;
        };
        const tokenExpirationTime = new Date(parsData.tokenExpirationDate);
        if (tokenExpirationTime <= new Date()) {
          return null;
        }
        const user = new UserModel(
          parsData.email,
          parsData.userId,
          parsData.fullNameEn,
          parsData.fullNameAr,
          parsData.userType,
          parsData.accountStatus,
          parsData.token,
          tokenExpirationTime
        );
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(
        (user) => !!user // return true if there is a value in the user object
      )
    );
  }

  private setUserData(userData: HttpResponse<AuthResponseData>) {
    console.log(userData);
    const currentime = new Date().getTime();
    const ms = currentime + +userData.headers.get('expires') * 1000;

    const expirationTime = new Date(currentime + +ms);
    const user = new UserModel(
      userData.headers.get('email'),
      userData.headers.get('userId'),
      userData.headers.get('fullNameEn'),
      userData.headers.get('fullNameAr'),
      userData.headers.get('userType'),
      userData.headers.get('accountStatus'),
      userData.headers.get('token'),
      expirationTime,
      userData.headers.get('driverNameEn'),
      userData.headers.get('driverNameAr'),
      userData.headers.get('terminatedFlag'),
      userData.headers.get('driverId'),
      userData.headers.get('spId'),
      userData.headers.get('spNameAr'),
      userData.headers.get('spNameEn'),
      userData.headers.get('spContactPersonEmail'),
      userData.headers.get('teamDescEn'),
      userData.headers.get('teamId'),
      userData.headers.get('vclId'),
      userData.headers.get('vclDescEn'),
      userData.headers.get('vclCode'),
      userData.headers.get('vclSizeDescEn'),
      userData.headers.get('vclSizeDescAr'),
      userData.headers.get('vclSizeId')
    );
    this.storeAuthData(
      userData.headers.get('userId'),
      userData.headers.get('token'),
      expirationTime.toISOString(),
      userData.headers.get('email'),
      userData.headers.get('fullNameEn'),
      userData.headers.get('fullNameAr'),
      userData.headers.get('userType'),
      userData.headers.get('accountStatus'),
      userData.headers.get('driverNameEn'),
      userData.headers.get('driverNameAr'),
      userData.headers.get('terminatedFlag'),
      userData.headers.get('driverId'),
      userData.headers.get('spId'),
      userData.headers.get('spNameAr'),
      userData.headers.get('spNameEn'),
      userData.headers.get('spContactPersonEmail'),
      userData.headers.get('teamDescEn'),
      userData.headers.get('teamId'),
      userData.headers.get('vclId'),
      userData.headers.get('vclDescEn'),
      userData.headers.get('vclCode'),
      userData.headers.get('vclSizeDescEn'),
      userData.headers.get('vclSizeDescAr'),
      userData.headers.get('vclSizeId')
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string,
    fullnameEn: string,
    fullnameAr: string,
    userType: string,
    accountStatus: string,
    driverNameEn?: string,
    driverNameAr?: string,
    terminatedFlag?: string,
    driverId?: string,
    spId?: string,
    spNameAr?: string,
    spNameEn?: string,
    spContactPersonEmail?: string,
    teamDescEn?: string,
    teamId?: string,
    vclId?: string,
    vclDescEn?: string,
    vclCode?: string,
    vclSizeDescEn?: string,
    vclSizeDescAr?: string,
    vclSizeId?: string
  ) {
    const data = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
      email,
      fullnameEn,
      fullnameAr,
      userType,
      accountStatus,
      driverNameEn,
      driverNameAr,
      terminatedFlag,
      driverId,
      spId,
      spNameAr,
      spNameEn,
      spContactPersonEmail,
      teamDescEn,
      teamId,
      vclId,
      vclDescEn,
      vclCode,
      vclSizeDescEn,
      vclSizeDescAr,
      vclSizeId,
    });
    Storage.set({ key: 'DriverAuthData', value: data });
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.userId;
        } else {
          return null;
        }
      })
    );
  }
  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  private autoLogout(duration: number) {
    console.log('*******autoLogout executed********');
    /* if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);*/
  }
}
