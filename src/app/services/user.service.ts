/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInfoModel } from '../shared/models/user-info-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url ='sys-owner-security/owner-auth';
  constructor(private http: HttpClient) { }

  loadUserInfo(token: string,customerId): Observable<UserInfoModel>{
    console.log('customerId=',customerId);
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.get<UserInfoModel>(`${environment.backEndApiRoot}/${this.url}/user/${customerId}`,{headers: headerInfo});
  }

  getDriverUserAccount(token: string ,driverId): Observable<UserInfoModel>{
    console.log('userId=',driverId);
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    return this.http.get<UserInfoModel>(`${environment.backEndApiRoot}/${this.url}/user/member/${driverId}`,{headers: headerInfo});
  }
}
