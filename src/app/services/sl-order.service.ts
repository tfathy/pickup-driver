/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SlOrderModel } from '../shared/models/sl-order-model';

@Injectable({
  providedIn: 'root',
})
export class SlOrderService {
  url = 'driver-app/driver';
  constructor(private http: HttpClient) {}

  findAvaliableOrders(token: string, vclSize): Observable<SlOrderModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SlOrderModel[]>(
      `${environment.backEndApiRoot}/${this.url}/avaliable-order/${vclSize}`,
      { headers: headerInfo }
    );
  }

  updateOrder(
    token: string,
    order: SlOrderModel,
    id: number
  ): Observable<SlOrderModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.put<SlOrderModel>(
      `${environment.backEndApiRoot}/order/${id}`,
      order,
      { headers: headerInfo }
    );
  }
}
