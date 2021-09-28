import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';
import { DriverAuthToken } from 'src/app/shared/common-utils';
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
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private fcmService: FcmService
  ) {}

  ngOnInit() {}
  back() {}
  accept() {
    let fcmGoogleNotification: FcmGoogleNotification;
    let msg: PushNotificationMessage;
    this.loadingCtrl
      .create({
        message: 'Sending notifications to customer ..',
      })
      .then((loadinElmnt) => {
        loadinElmnt.present();
        const moreInfo = new NotificationMoreInfo('more information goes here');
        msg = new PushNotificationMessage(
          'Acceptded',
          'your request has been accepted',
          ''
        );
        fcmGoogleNotification = new FcmGoogleNotification(
          msg,
          moreInfo,
          this.pushMessageToken
        );
        console.log('fcmGoogleNotification=',fcmGoogleNotification);
        this.fcmService.sendNotification(fcmGoogleNotification).subscribe(
          (notificationResponse) => {
            console.log(notificationResponse);
            loadinElmnt.dismiss();
          },
          (err) => {
            console.log(err);
          }
        );
      });
  }
}
