import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DriverService } from './driver.service';
import { DriverAuthToken, readStorage } from '../shared/common-utils';
@Injectable({
  providedIn: 'root',
})
export class FcmService {
  driverToken: DriverAuthToken;
  //https://medium.com/techshots/learn-to-use-firebase-cloud-messaging-to-receive-push-notification-in-ionic-4-vue-app-using-13f5a4458b87
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private driverService: DriverService
  ) {}
  async initPush() {
    this.driverToken = await readStorage('DriverAuthData');
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        this.showAlert('********************NO permission');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      //  this.showAlert('My token: ' + JSON.stringify(token));
      console.log('token:', JSON.stringify(token));
      // you have to store this token with user id in the database
      this.driverService
        .getDriver('Bearer ' + this.driverToken.token, this.driverToken.userId)
        .subscribe((responseEntity) => {
          responseEntity.fcmToken = token.value;
          console.log(responseEntity);
          this.driverService
            .updateDriverToken(
              'Bearer ' + this.driverToken.token,
              this.driverToken.userId,
              responseEntity
            )
            .subscribe((resUpdated) => {
              console.log(resUpdated);
            },err=>{
              console.log(err);
            });
        },error=>{
          console.log(error);
        });
    });
    PushNotifications.addListener('registrationError', (error: any) => {
      this.showAlert('Error: ' + JSON.stringify(error));
    });
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        this.showAlert('Push received: ' + JSON.stringify(notification));
        // fires when notification received
      }
    );
    // the following listner fires when the user has clicked on the notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data; // this means retrive the parameters comming with the notification
        this.showAlert(
          'Action performed: ' + JSON.stringify(notification.notification)
        );
        if (data.detailsId) {
          // this.router.navigateByUrl(`/home/${data.detailsId}`);
          this.showAlert(data);
        }
      }
    );
  }

  private showAlert(msg: string) {
    this.alertCtrl
      .create({
        message: msg,
        buttons: ['Ok'],
      })
      .then((alertElmnt) => {
        alertElmnt.present();
      });
  }
}
