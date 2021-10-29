import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';
import { DriverAuthToken } from 'src/app/shared/common-utils';
import { TranslateService } from '@ngx-translate/core';
import {
  FcmGoogleNotification,
  NotificationMoreInfo,
  PushNotificationMessage,
} from 'src/app/shared/models/fcm-google-nofification';
import { SlOrderModel } from 'src/app/shared/models/sl-order-model';

@Component({
  selector: 'app-open-request-details',
  templateUrl: './open-request-details.component.html',
  styleUrls: ['./open-request-details.component.scss'],
})
export class OpenRequestDetailsComponent implements OnInit {
  @Input() payload: SlOrderModel;
  @Input() authToken: DriverAuthToken;
  @Input() pushMessageToken: string;
  messageTitle;
  messageBody;
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private fcmService: FcmService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.translateService
      .get('NOTIFICATION_2CUSTOMER_ACCEPT_TITLE')
      .subscribe((retValue) => {
        this.messageTitle = retValue;
      });
  }
  back() {
    this.modalCtrl.dismiss();
  }
  setPropodsalVale() {

    if(!this.payload.estimatedCost){
      return;
    }
    this.translateService
    .get('NOTIFICATION_2CUSTOMER_ACCEPT_BODY')
    .subscribe((retValue) => {
      this.messageBody = retValue+this.payload.estimatedCost;
    });

    let fcmGoogleNotification: FcmGoogleNotification;
    let msg: PushNotificationMessage;
    this.loadingCtrl
      .create({
        message: 'Sending proposal to the customer ..',
      })
      .then((loadinElmnt) => {
        loadinElmnt.present();
        const moreInfo = new NotificationMoreInfo(this.payload);
        msg = new PushNotificationMessage(
          this.messageTitle,
          this.messageBody,
          'https://owner.pickup-sa.net/assets/icon/vcl-green.png'
        );
        fcmGoogleNotification = new FcmGoogleNotification(
          msg,
          moreInfo,
          this.pushMessageToken
        );
        this.fcmService.sendNotification(fcmGoogleNotification).subscribe(
          (notificationResponse) => {
            console.log(notificationResponse);
            loadinElmnt.dismiss();
            this.modalCtrl.dismiss({ accepted: true });
          },
          (err) => {
            console.log(err);
          }
        );
      });
  }
}
