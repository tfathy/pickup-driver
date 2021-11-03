/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderLocationModel } from '../shared/models/order-location-model';

@Injectable({
  providedIn: 'root',
})
export class OrderLocationService {
  private url = 'driver-app/order-location';
  constructor(private http: HttpClient) {}

  createOrderLocation(
    token: string,
    model: OrderLocationModel
  ): Observable<OrderLocationModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.post<OrderLocationModel>(
      `${environment.backEndApiRoot}/${this.url}`,
      model,
      { headers: headerInfo }
    );
  }
}
