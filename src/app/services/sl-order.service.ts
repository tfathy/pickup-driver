/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OrderImagesModel } from '../shared/models/order-images-model';
import { SlOrderModel } from '../shared/models/sl-order-model';

@Injectable({
  providedIn: 'root',
})
export class SlOrderService {
  url = 'driver-app/driver';
  orderImagesUrl = 'customer-app/attachment/order-images';
  constructor(private http: HttpClient) {}
  findById(token: string, id): Observable<SlOrderModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<SlOrderModel>(
      `${environment.backEndApiRoot}/customer-app/customer/order/${id}`,
      { headers: headerInfo }
    );
  }

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
    console.log('updateOrder data the new order must be this', order);
    return this.http.put<SlOrderModel>(
      `${environment.backEndApiRoot}/${this.url}/order/${id}`,
      order,
      { headers: headerInfo }
    );
  }

  findOrderImagesByOrdId(token: string, ordId): Observable<OrderImagesModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    console.log('driver token=',token);
    return this.http.get<OrderImagesModel[]>(
      `${environment.backEndApiRoot}/${this.orderImagesUrl}/${ordId}`,
      { headers: headerInfo }
    ).pipe(map(responseArray=>responseArray.map(record=>new OrderImagesModel(record.id,
      record.ordId,
      `${environment.fileDownloadUrl}/${record.imageName}`,
      record.imageExt,record.imageSize))));
  }

}
