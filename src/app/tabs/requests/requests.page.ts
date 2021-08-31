import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DriverAuthToken, readStorage } from 'src/app/shared/common-utils';
import { DriverModel } from 'src/app/shared/models/driver-model';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  currentLocation = { lat: null, lng: null };
  driverToken: DriverAuthToken;
  driver: DriverModel;
  currentLang: string;
  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService
  ) {}

  async ngOnInit() {
    this.currentLang = this.translateService.getDefaultLang();
    this.driverToken = await readStorage('DriverAuthData');
    this.loadingCtrl
      .create({
        message: 'Picking current location... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
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

    this.authService
      .loadUserInfo(
        'Bearer ' + this.driverToken.token,
        this.driverToken.userId
      )
      .subscribe(
        (data) => {
          this.driver = data.driver;
        },
        (error) => {
          console.log('error in authService', error);
        }
      );
  }

  viewRequests() {}
  logout() {}
}
