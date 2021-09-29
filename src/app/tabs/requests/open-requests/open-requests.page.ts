import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { SlOrderService } from 'src/app/services/sl-order.service';
import { UserService } from 'src/app/services/user.service';
import { DriverAuthToken, readStorage } from 'src/app/shared/common-utils';
import {
  FcmGoogleNotification,
  PushNotificationMessage,
} from 'src/app/shared/models/fcm-google-nofification';
import { SlOrderModel } from 'src/app/shared/models/sl-order-model';
import { OpenRequestDetailsComponent } from './open-request-details/open-request-details.component';

@Component({
  selector: 'app-open-requests',
  templateUrl: './open-requests.page.html',
  styleUrls: ['./open-requests.page.scss'],
})
export class OpenRequestsPage implements OnInit {
  driverToken: DriverAuthToken;
  openOrders: SlOrderModel[];
  fcmGoogleNotification: FcmGoogleNotification;
  msg: PushNotificationMessage;
  fcmToke: string;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private orderServices: SlOrderService,
    private userService: UserService,
    private alertController: AlertController,
    private modalCtrl: ModalController
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
  openDetails(model: SlOrderModel) {
    this.loadingCtrl
      .create({
        message: 'fetching request details ..please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.userService
          .loadUserInfo('Bearer' + this.driverToken.token, model.customer.id)
          .subscribe(
            (orderResponse) => {
              const fcmToken = orderResponse.fcmToken;
              loadingElmnt.dismiss();
              this.modalCtrl
                .create({
                  component: OpenRequestDetailsComponent,
                  componentProps: {
                    payload: model,
                    authToken: this.driverToken,
                    pushMessageToken: fcmToken,
                  },
                })
                .then((modalCtrl) => {
                  modalCtrl.present();
                  modalCtrl.onDidDismiss().then((dismissData) => {
                    if (dismissData.data.accepted) {
                      model.ordStatus = 'ACCEPTED';
                      model.team = this.drverTeam;
                      this.orderServices
                        .updateOrder(
                          'Bearer' + this.driverToken.token,
                          model,
                          model.id
                        )
                        .subscribe((updatedDataResponse) => {
                          console.log(updatedDataResponse);
                          this.showAlert('You accepted the request');
                        },error=>{
                          console.log(error);
                          this.showAlert('error. The request cannot be taken');
                        });
                    }
                  });
                });
            },
            (error) => {
              loadingElmnt.dismiss();
              console.log(error);
              this.showAlert(
                'Error: cannot get message token for the customer'
              );
            }
          );
      });
  }
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
