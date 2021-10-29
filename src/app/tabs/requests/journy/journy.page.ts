import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FcmService } from 'src/app/services/fcm.service';
import { SlOrderService } from 'src/app/services/sl-order.service';
import { DriverAuthToken, readStorage } from 'src/app/shared/common-utils';
import { SlOrderModel } from 'src/app/shared/models/sl-order-model';
import { UserService } from 'src/app/services/user.service';
import {
  NotificationMoreInfo,
  PushNotificationMessage,
  FcmGoogleNotification,
} from 'src/app/shared/models/fcm-google-nofification';

@Component({
  selector: 'app-journy',
  templateUrl: './journy.page.html',
  styleUrls: ['./journy.page.scss'],
})
export class JournyPage implements OnInit {
  orderId;
  order: SlOrderModel;
  moreInfoText: string;
  msgText: string;
  driverToken: DriverAuthToken;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadinCtrl: LoadingController,
    private fcmService: FcmService,
    private userService: UserService,
    private orderService: SlOrderService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadinCtrl
      .create({
        message: ' loading journey....',
      })
      .then(async (loadingElmnt) => {
        loadingElmnt.present();
        this.translateService
          .get('DRIVER_START_JOURNEY_DETAILS')
          .subscribe((txt) => {
            this.moreInfoText = txt;
          });
        this.translateService.get('DRIVER_START_JOURNEY').subscribe((txt) => {
          this.msgText = txt;
        });

        this.driverToken = await readStorage('DriverAuthData');

        this.route.paramMap.subscribe((params) => {
          this.orderId = params.get('id');
          // read parameter  order id
          this.orderService
            .findById('Bearer ' + this.driverToken.token, this.orderId)
            .subscribe(
              (orderDataResponse) => {
                this.order = orderDataResponse;
                loadingElmnt.dismiss();
              },
              (error) => {
                console.error(error);
                loadingElmnt.dismiss();
              }
            );
        });
      });
  }
  cancelJourney() {}
  endJoureny(){

  }
  startJoury() {
    this.loadinCtrl
      .create({
        message: 'Starting journey...',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.order.ordStatus = 'JOURNEY_STARTED';
        this.userService
          .loadUserInfo(
            'Bearer ' + this.driverToken.token,
            this.order.customer.id
          )
          .subscribe((userInfoRes) => {
            const fcmToke = userInfoRes.fcmToken;
            const moreInfo = new NotificationMoreInfo(this.order);
            const msg: PushNotificationMessage = new PushNotificationMessage(
              this.msgText,
              this.moreInfoText,
              ''
            );
            const fcmGoogleNotification: FcmGoogleNotification =
              new FcmGoogleNotification(msg, moreInfo, fcmToke);
            this.fcmService
              .sendNotification(fcmGoogleNotification)
              .subscribe((notificationResponse) => {
                //save order after status update
                this.orderService
                  .updateOrder(
                    'Bearer ' + this.driverToken.token,
                    this.order,
                    this.order.id
                  )
                  .subscribe((orderChangeRes) => {
                    console.log('updated order=', orderChangeRes);
                    loadingElmnt.dismiss();
                  });
              });
          });
      });
  }

  back(){
    this.router.navigate(['/','tabs','requests']);
  }
}