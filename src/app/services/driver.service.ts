/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DriverTokenResponseModel } from '../shared/models/driver-token-response-model';
import { SlTeamModel } from '../shared/models/sl-team-model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  securityUrl = 'driver-security-app/driver-auth';
  driverAppUrl = 'driver-app/driver';
  constructor(private http: HttpClient) {}

  getDriver(
    token: string,
    userId: string
  ): Observable<DriverTokenResponseModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<DriverTokenResponseModel>(
      `${environment.backEndApiRoot}/${this.securityUrl}/driver/${userId}`,
      { headers: headerInfo }
    );
  }

  updateDriverToken(
    token: string,
    userId: string,
    model: DriverTokenResponseModel
  ): Observable<DriverTokenResponseModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.put<DriverTokenResponseModel>(
      `${environment.backEndApiRoot}/${this.securityUrl}/${userId}`,
      model,
      { headers: headerInfo }
    );
  }
  getManagerTeam(token: string, driverId): Observable<SlTeamModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SlTeamModel>(
      `${environment.backEndApiRoot}/${this.driverAppUrl}/team/${driverId}`,
      { headers: headerInfo }
    );
  }
}
