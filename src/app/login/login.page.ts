import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { readStorage } from '../shared/common-utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  emailLoginForm: FormGroup;
  constructor(private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private http: HttpClient) { }

  ngOnInit() {
    this.emailLoginForm = new FormGroup({
      username: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  back(){
    this.router.navigate(['/']);

  }

  loginAction() {
    this.loadingCtrl
      .create({
        message: 'Log in .... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.authService
          .authLogin(this.username.value, this.password.value)
          .subscribe(
            () => {
              readStorage('DriverAuthData').then((storageData) => {
                const status = storageData.accountStatus;
                if (status === 'NOT-VERIFIED') {
                  this.showToast(
                    'Please Change your password',
                    3000
                  );
                  this.router.navigate([
                    '/',
                    'tabs',
                    'settings'
                  ]);
                } else {
                  this.router.navigate(['/', 'tabs', 'requests']);
                }
                loadingElmnt.dismiss();
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
}
