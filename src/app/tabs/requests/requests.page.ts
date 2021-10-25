import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  ModalController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DriverAuthToken, readStorage } from 'src/app/shared/common-utils';
import { DriverModel } from 'src/app/shared/models/driver-model';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from 'src/app/services/auth.service';
import { SlOrderModel } from 'src/app/shared/models/sl-order-model';
import { SlOrderService } from 'src/app/services/sl-order.service';

import { FcmService } from 'src/app/services/fcm.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RealDataService } from 'src/app/services/real-data.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit, AfterViewInit {
  avaliable = true;
  currentLocation = { lat: null, lng: null };
  driverToken: DriverAuthToken;
  avaliableRequest: SlOrderModel[] = [];
  driver: DriverModel;
  currentLang: string;

  constructor(
    private modalCtrl: ModalController,
    public realDataService: RealDataService,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService,
    private orderService: SlOrderService,
    private fcmService: FcmService
  ) {}
  ngAfterViewInit(): void {}

  async ngOnInit() {
    this.currentLang = this.translateService.getDefaultLang();
    this.driverToken = await readStorage('DriverAuthData');
    await this.realDataService.reloadOrders();
    this.loadingCtrl
      .create({
        message: 'accessing location',
      })
      .then((loadingElmnt) => {
        Geolocation.getCurrentPosition().then(
          (coordinates) => {
            this.currentLocation.lat = coordinates.coords.latitude;
            this.currentLocation.lng = coordinates.coords.longitude;
            loadingElmnt.dismiss();
          },
          (rejected) => {
            loadingElmnt.dismiss();
            console.log(rejected);
          }
        );
      });

    // this.orderService
    //   .findAvaliableOrders(
    //     'Bearer ' + this.driverToken.token,
    //     this.driverToken.vclSizeId
    //   )
    //   .subscribe(
    //     (resData) => {
    //       this.avaliableRequest = resData;
    //       console.log(' this.avaliableRequest =', resData);
    //       this.loadingCtrl
    //         .create({
    //           message: 'Picking current location... please wait',
    //         })
    //         .then((loadingElmnt) => {
    //           loadingElmnt.present();
    //           //populate avaliableRequest to be marked on the map

    //           Geolocation.getCurrentPosition().then(
    //             (coordinates) => {
    //               this.currentLocation.lat = coordinates.coords.latitude;
    //               this.currentLocation.lng = coordinates.coords.longitude;
    //               loadingElmnt.dismiss();
    //             },
    //             (rejected) => {
    //               loadingElmnt.dismiss();
    //               console.log(rejected);
    //             }
    //           );
    //         });
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );

    this.authService
      .loadUserInfo('Bearer ' + this.driverToken.token, this.driverToken.userId)
      .subscribe(
        (data) => {
          this.driver = data.driver;
        },
        (error) => {
          console.log('error in authService', error);
        }
      );

    this.fcmService.initPush();
  }

  viewRequests() {
    this.router.navigate(['/', 'tabs', 'requests', 'open-requests']);
  }
  logout() {}

  driverStatusChange() {
    this.avaliable = !this.avaliable;
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
