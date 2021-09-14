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
@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(private router: Router, private alertCtrl: AlertController) {}
  initPush() {
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
      console.log('token:',JSON.stringify(token));
      // you have to store this token with user id in the database
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
