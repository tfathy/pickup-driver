import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DriverService } from 'src/app/services/driver.service';
import { SlOrderService } from 'src/app/services/sl-order.service';
import { UserService } from 'src/app/services/user.service';
import { DriverAuthToken, readStorage } from 'src/app/shared/common-utils';
import { OrderImagesModel } from 'src/app/shared/models/order-images-model';
import { SlOrderModel } from 'src/app/shared/models/sl-order-model';
import { SlTeamModel } from 'src/app/shared/models/sl-team-model';
import { environment } from 'src/environments/environment';
import { OpenRequestDetailsComponent } from '../open-requests/open-request-details/open-request-details.component';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.page.html',
  styleUrls: ['./request-detail.page.scss'],
})
export class RequestDetailPage implements OnInit {
  downloadUrl = `${environment.fileDownloadUrl}`;
  driverToken: DriverAuthToken;
  model: SlOrderModel;
  drverTeam: SlTeamModel;
  images: OrderImagesModel[];
  fcmToken;
  constructor(
    private router: Router,
    private rout: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private orderService: SlOrderService,
    private driverService: DriverService,
    private translateService: TranslateService,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.driverToken = await readStorage('DriverAuthData');

    this.rout.paramMap.subscribe((param) => {
      console.log(param.get('id'));
      const id = param.get('id');
      this.loadingCtrl
        .create({
          message: 'fetchimg data',
        })
        .then((loadingElmnt) => {
          loadingElmnt.present();
          // get order details by order id
          this.orderService
            .findById('Bearer ' + this.driverToken.token, id)
            .subscribe((ordData) => {
              console.log('ordData=', ordData);
              this.model = ordData;
              //get order images by order id
              this.orderService
                .findOrderImagesByOrdId('Bearer ' + this.driverToken.token, id)
                .subscribe((imagesInfo) => {
                  console.log('images=', imagesInfo);
                  this.images = imagesInfo;
                });
              // read the team info for this driver

              this.driverService
                .getManagerTeam(
                  'Bearer ' + this.driverToken.token,
                  this.driverToken.driverId
                )
                .subscribe((teamResponseData) => {
                  // this dirver must be a manager for a team . return his team object
                  console.log('team=', teamResponseData);
                  this.drverTeam = teamResponseData;
                  loadingElmnt.dismiss();
                });

              this.userService
                .loadUserInfo(
                  'Bearer ' + this.driverToken.token,
                  ordData.customer.id
                )
                .subscribe(
                  (orderResponse) => {
                    this.fcmToken = orderResponse.fcmToken;
                    loadingElmnt.dismiss();
                  },
                  (error) => {
                    loadingElmnt.dismiss();
                    console.log(error);
                  }
                );
            });
        });
    });
  }
  back() {
    this.router.navigate(['/', 'tabs', 'requests', 'open-requests']);
  }
  phoneCustomer(phoneNum) {}


  sendProposal(orderModel) {
    this.modalCtrl
      .create({
        component: OpenRequestDetailsComponent,
        componentProps: {
          payload: orderModel,
          authToken: this.driverToken,
          pushMessageToken: this.fcmToken,
        },
      })
      .then((modalCtrl) => {
        modalCtrl.present();
        modalCtrl.onDidDismiss().then((dismissData) => {
          if (dismissData.data.accepted) {
            orderModel.ordStatus = 'PROPOSAL';
            orderModel.team = this.drverTeam; // update the order ,this team takes this order
            this.orderService
              .updateOrder(
                'Bearer ' + this.driverToken.token,
                orderModel,
                orderModel.id
              )
              .subscribe(
                (updatedDataResponse) => {
                  console.log(updatedDataResponse);
                  this.showAlert(
                    'PROPOSAL_IS_SENT'
                  );
                },
                (error) => {
                  console.log(error);
                  this.showAlert('ERROR');
                }
              );
          }
        });
      });
  }

  private showAlert(msgKey: string) {
    this.translateService.get(msgKey).subscribe((msgText) => {
      this.alertController
        .create({
          header: ' Notification',
          message: msgText,
          buttons: ['OK'],
        })
        .then((alertElmnt) => {
          alertElmnt.present();
        });
    });
  }
}
