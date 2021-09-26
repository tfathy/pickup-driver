import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SlOrderService } from 'src/app/services/sl-order.service';
import { DriverAuthToken, readStorage } from 'src/app/shared/common-utils';
import { SlOrderModel } from 'src/app/shared/models/sl-order-model';

@Component({
  selector: 'app-open-requests',
  templateUrl: './open-requests.page.html',
  styleUrls: ['./open-requests.page.scss'],
})
export class OpenRequestsPage implements OnInit {
  driverToken: DriverAuthToken;
  openOrders: SlOrderModel[];
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private orderServices: SlOrderService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'fetching orders details...please wait',
      })
      .then(async (loadingElmnt) => {
        loadingElmnt.present();
        this.driverToken = await readStorage('DriverAuthData');
        this.orderServices
          .findAvaliableOrders(
            'Bearer ' + this.driverToken.token,
            this.driverToken.vclSizeId
          )
          .subscribe(
            (resData) => {
              this.openOrders = resData;
              loadingElmnt.dismiss();
            },
            (error) => {
              console.log(error);
              this.showAlert('Error:Cannot fetch open orders.');
            }
          );
      });
  }
  openDetails(model: SlOrderModel) {}
  back() {
    this.router.navigate(['/', 'tabs', 'requests']);
  }

  private showAlert(msg: string) {
    this.alertController
      .create({
        message: msg,
        buttons: ['Ok'],
      })
      .then((elmnt) => {
        elmnt.present();
      });
  }
}
