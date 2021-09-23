/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DriverTokenResponseModel } from '../shared/models/driver-token-response-model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  url = 'driver-security-app/driver-auth';
  constructor(private http: HttpClient) {}

  getDriver(
    token: string,
    userId: string
  ): Observable<DriverTokenResponseModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<DriverTokenResponseModel>(
      `${environment.backEndApiRoot}/${this.url}/driver/${userId}`,
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
      `${environment.backEndApiRoot}/${this.url}/${userId}`,
      model,
      { headers: headerInfo }
    );
  }
}
