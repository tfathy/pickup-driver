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
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<UserModel>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  authLogin(loginEmail: string, loginPassword: string) {
    return this.http
      .post<any>(
        `${environment.backEndApiRoot}/sys-owner-security/owner-auth/login`,
        {
          email: loginEmail,
          password: loginPassword,
        },
        { observe: 'response' }
      )
      .pipe(
        tap((res) => {
          console.log(res);
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
      `${environment.backEndApiRoot}/sys-owner-security/owner-auth/${userId}`
    );
    return this.http.get<UserResponseData>(
      `${environment.backEndApiRoot}/sys-owner-security/owner-auth/${userId}`,
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
        console.log('User stored is:' + user);
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
      expirationTime
    );
    this.storeAuthData(
      userData.headers.get('userId'),
      userData.headers.get('token'),
      expirationTime.toISOString(),
      userData.headers.get('email'),
      userData.headers.get('fullNameEn'),
      userData.headers.get('fullNameAr'),
      userData.headers.get('userType'),
      userData.headers.get('accountStatus')
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
    accountStatus: string
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
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }
}
