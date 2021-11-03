/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DriverUserResponseModel } from '../shared/models/driver-user-response-model';
import { LoginInfoModel } from '../shared/models/login-info-model';

@Injectable({
  providedIn: 'root',
})
export class LoginInfoService {
  url = 'driver-app';
  driverSecurityUrl = 'driver-security-app/driver-auth/user-info';
  constructor(private http: HttpClient) {}

  createLoginInfo(
    token: string,
    loginInfo: LoginInfoModel
  ): Observable<LoginInfoModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    console.log('loginInfo', loginInfo);
    return this.http.post<LoginInfoModel>(
      `${environment.backEndApiRoot}/${this.url}/driver/user-login-info`,
      loginInfo,
      {
        headers: headerInfo,
      }
    );
  }

  updateUserLoginInfoStatus(
    token: string,
    userId,
    oldStatus,
    newStatus
  ): Observable<boolean> {
    ///driver/user-login-info/status/{userId}/{oldStatus}/{newStatus} to update the status  in user_login_info table
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.put<boolean>(
      `${environment.backEndApiRoot}/${this.url}/driver/user-login-info/status/${userId}/${oldStatus}/${newStatus}`,
      null,
      { headers: headerInfo }
    );
  }

  loadUserData(
    token: string,
    userId: string
  ): Observable<DriverUserResponseModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<DriverUserResponseModel>(
      `${environment.backEndApiRoot}/${this.driverSecurityUrl}/${userId}`,
      { headers: headerInfo }
    );
  }
}
