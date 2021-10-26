import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DriverAuthToken, readStorage } from '../shared/common-utils';
import { SlOrderModel } from '../shared/models/sl-order-model';
import { SlOrderService } from './sl-order.service';

@Injectable({
  providedIn: 'root',
})
export class RealDataService {
  avaliableRequest: SlOrderModel[] = [];
  driverToken: DriverAuthToken;
  constructor(private orderService: SlOrderService) {}

  async reloadOrders() {
    this.driverToken = await readStorage('DriverAuthData');
    this.orderService
      .findAvaliableOrders(
        'Bearer ' + this.driverToken.token,
        this.driverToken.vclSizeId
      )
      .subscribe((resData) => {
        this.avaliableRequest = resData;
        console.log(' data reploaded :avaliableRequest =', resData);
      },error=>{
        console.log('error while loading list of orders',error);
      });
  }
}
