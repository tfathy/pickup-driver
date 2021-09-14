import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { LoginInfoService } from '../services/login-info.service';
import { DriverAuthToken, readStorage } from '../shared/common-utils';
import { LoginInfoModel } from '../shared/models/login-info-model';
import { SysUserModel } from '../shared/models/sys-user-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  emailLoginForm: FormGroup;
  token: DriverAuthToken;
  loginInfo: LoginInfoModel;
  longit;
  latit;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private loginInfoService: LoginInfoService
  ) {}

  ngOnInit() {
    this.emailLoginForm = new FormGroup({
      username: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    Geolocation.getCurrentPosition().then(
      (coordinates) => {
        this.longit = coordinates.coords.latitude;
        this.latit = coordinates.coords.longitude;
      },
      (rejected) => {
        this.showErrorAlert(rejected);
        console.log(rejected);
      }
    );
  }
  back() {
    this.router.navigate(['/']);
  }

  loginAction() {
    if (this.longit === null || this.latit === null) {
      this.showErrorAlert('GPS is not enabled. You must enable GPS');
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Log in .... please wait',
      })
      .then((loadingElmnt) => {
        this.authService
          .authLogin(this.username.value, this.password.value)
          .subscribe(
            () => {
              console.log('**********authLogin 1**************');
              readStorage('DriverAuthData').then((storageData) => {
                console.log('**********readStorage start**************');
                this.token = storageData;
                console.log('this.token.userId', this.token.userId);
                this.loginInfoService
                  .loadUserData('Bearer ' + this.token.token, this.token.userId)
                  .subscribe(
                    (userDataResponse) => {
                      console.log(
                        'in loginInfoService.loadUserData= returns',
                        userDataResponse
                      );
                      console.log('loginInfoService');
                      const sysUser = new SysUserModel(userDataResponse.id);
                      this.loginInfo = new LoginInfoModel(
                        null,
                        sysUser,
                        new Date(),
                        null,
                        'AVALIABLE',
                        this.longit,
                        this.latit,
                        this.token.vclId,
                        this.token.vclCode,
                        this.token.vclDescEn,
                        this.token.vclSizeId,
                        this.token.vclSizeDescEn,
                        this.token.vclSizeDescAr,
                        this.token.teamDescEn,
                        this.token.teamId,
                        this.token.driverNameAr,
                        this.token.driverNameEn,
                        this.token.driverId,
                        this.token.spNameAr,
                        this.token.spNameEn,
                        this.token.spId
                      );
                      this.loginInfoService
                        .createLoginInfo(
                          'Bearer ' + this.token.token,
                          this.loginInfo
                        )
                        .subscribe(
                          (resData) => {
                            console.log(
                              'loginInfoService.createLoginInfo returns ',
                              resData
                            );
                            const status = storageData.accountStatus;
                            if (status === 'NOT-VERIFIED') {
                              this.showToast(
                                'Please Change your password',
                                3000
                              );
                              this.router.navigate(['/', 'tabs', 'settings']);
                            } else {
                              this.router.navigate(['/', 'tabs', 'requests']);
                            }
                            loadingElmnt.dismiss();
                          },
                          (error) => {
                            console.log(error);
                            loadingElmnt.dismiss();
                          }
                        );
                    },
                    (error) => {
                      console.log(error);
                      loadingElmnt.dismiss();
                    }
                  );
              });
            },
            (error) => {
              loadingElmnt.dismiss();
              console.log(error);
            }
          );
      });
  }
  get username() {
    return this.emailLoginForm.get('username');
  }

  get password() {
    return this.emailLoginForm.get('password');
  }

  private showToast(msg: string, durationLimit) {
    this.toastCtrl
      .create({
        message: msg,
        duration: durationLimit,
        position: 'middle',
      })
      .then((toastElmnt) => {
        toastElmnt.present();
      });
  }
  private showErrorAlert(msg) {
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
