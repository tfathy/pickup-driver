import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FcmService } from 'src/app/services/fcm.service';
import { SlOrderService } from 'src/app/services/sl-order.service';
import { DriverAuthToken, readStorage } from 'src/app/shared/common-utils';
import { SlOrderModel } from 'src/app/shared/models/sl-order-model';
import { UserService } from 'src/app/services/user.service';
import { ClearWatchOptions, Geolocation } from '@capacitor/geolocation';
import {
  NotificationMoreInfo,
  PushNotificationMessage,
  FcmGoogleNotification,
} from 'src/app/shared/models/fcm-google-nofification';
import { LoginInfoService } from 'src/app/services/login-info.service';
import { OrderLocationModel } from 'src/app/shared/models/order-location-model';
import { OrderLocationService } from 'src/app/services/order-location.service';

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
  currentUserId;
  locationStatus;
  journyEnded = false;

  public lat: any;
  public lng: any;
  oldlat = '';
  oldLng = '';
  public wait: Promise<string>;

  constructor(
    public ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private loadinCtrl: LoadingController,
    private alertCtrl: AlertController,
    private fcmService: FcmService,
    private userService: UserService,
    private loginInfoService: LoginInfoService,
    private orderService: SlOrderService,
    private translateService: TranslateService,
    private orderLocationService: OrderLocationService
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
        this.userService
          .getDriverUserAccount(
            'Bearer ' + this.driverToken.token,
            this.driverToken.driverId
          )
          .subscribe((loginUserInfoRes) => {
            console.log('getDriverUserAccountRes=', loginUserInfoRes);
            console.log('loginUserInfoRes.id=', loginUserInfoRes.id);
            this.currentUserId = loginUserInfoRes.id;
          });

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
  endJoureny() {
    this.stopTrack();
    this.stopJourney();
  }
  startJoury() {
    this.loadinCtrl
      .create({
        message: 'Starting journey...',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.order.ordStatus = 'JOURNEY_STARTED';
        this.order.ordExecDate = new Date();
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
                    // update login info table set status = busy for the user - parameters : status id id of the user
                    console.log('this.currentUserId=', this.currentUserId);
                    this.loginInfoService
                      .updateUserLoginInfoStatus(
                        'Bearer ' + this.driverToken.token,
                        this.currentUserId,
                        'AVALIABLE',
                        'BUSY'
                      )
                      .subscribe(
                        (userLoginRes) => {
                          console.log(
                            'updateUserLoginInfoStatus=',
                            userLoginRes
                          );
                          this.watchTrack();
                          loadingElmnt.dismiss();
                        },
                        (updateError) => {
                          console.log(
                            'Error in updateUserLoginInfoStatus',
                            updateError
                          );
                          loadingElmnt.dismiss();
                        }
                      );
                  });
              });
          });
      });
  }

  watchTrack() {
    // insert record in sys_order_location table status =start
    this.locationStatus = 'START';
    this.wait = Geolocation.watchPosition({}, (position, err) => {
      console.log('watchTrack watchPosition executed');
      if(!this.journyEnded){
        this.ngZone.run(() => {
          console.log('ngZone  executed');
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          // if location changes - the car has moved, then insert the new location on the database
          if (this.oldlat !== this.lat || this.oldLng !== this.lng) {
            const newLocation = new OrderLocationModel();
            newLocation.lat = this.lat;
            newLocation.lng = this.lng;
            newLocation.locationDate = new Date();
            newLocation.slOrder = this.order;
            newLocation.status = this.locationStatus;
            this.locationStatus = '';
            this.orderLocationService
              .createOrderLocation(
                'Bearer ' + this.driverToken.token,
                newLocation
              )
              .subscribe(
                (res) => {
                  console.log('newLocation created ', res);
                },
                (error) => {
                  console.log(error);
                }
              );
            this.oldlat = this.lat;
            this.oldLng = this.lng;
          }
          console.log(
            'location changed===> ',
            'lat: ' +
              this.lat +
              ' lng:' +
              this.lng +
              ' oldLat=' +
              this.oldlat +
              ' oldLng=' +
              this.oldLng
          );
        });
      }

    });
  }

  async stopTrack() {
    console.log('this.wait=', this.wait);
    const opt: ClearWatchOptions = { id: await this.wait };
    const close =await Geolocation.clearWatch(opt);
    console.log('close watch=',close);
  }

  back() {
    this.router.navigate(['/', 'tabs', 'requests']);
  }
  private async stopJourney() {
    this.loadinCtrl
      .create({
        message: 'Emding Journey',
      })
      .then(async (loadingEl) => {
        loadingEl.present();
        const newLocation = new OrderLocationModel();
        newLocation.lat = this.lat;
        newLocation.lng = this.lng;
        newLocation.locationDate = new Date();
        newLocation.slOrder = this.order;
        newLocation.status = 'END';
        this.orderLocationService
          .createOrderLocation('Bearer ' + this.driverToken.token, newLocation)
          .subscribe(
            (res) => {
              console.log('newLocation created ', res);
              this.endJourny('JOURNEY_ENDED', 'BUSY','AVALIABLE');
              this.journyEnded=true;
              loadingEl.dismiss();
              this.back();
            },
            (error) => {
              console.log(error);
              loadingEl.dismiss();
            }
          );
        // update login info table set status = busy for the user - parameters : status id id of the user
      });
  }

  private async endJourny(journeyStatus,driverOldStatus, driverNewStatus) {
    this.loadinCtrl
      .create({
        message: 'Updating journey...',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.order.ordStatus = journeyStatus;
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
            this.translateService
              .get('DRIVER_END_JOURNEY_DETAILS')
              .subscribe((txt) => {
                this.moreInfoText = txt;
              });
            this.translateService.get('DRIVER_END_JOURNEY').subscribe((txt) => {
              this.msgText = txt;
            });
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
                    // update login info table set status = busy for the user - parameters : status id id of the user
                    console.log('this.currentUserId=', this.currentUserId);
                    this.loginInfoService
                      .updateUserLoginInfoStatus(
                        'Bearer ' + this.driverToken.token,
                        this.currentUserId,
                        driverOldStatus,driverNewStatus
                      )
                      .subscribe(
                        (userLoginRes) => {
                          console.log(
                            'updateUserLoginInfoStatus=',
                            userLoginRes
                          );
                          this.watchTrack();
                          loadingElmnt.dismiss();
                        },
                        (updateError) => {
                          console.log(
                            'Error in updateUserLoginInfoStatus',
                            updateError
                          );
                          loadingElmnt.dismiss();
                        }
                      );
                  });
              });
          });
      });
  }
}
