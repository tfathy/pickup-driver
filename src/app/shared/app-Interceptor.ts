import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';

@Injectable()
export class AppInterceptor implements HttpInterceptor{
  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        console.log(err.status);
         if (err.status === 401) {
          this.showAlert(err.status,'Token Expired. Re-login to get new token');
            this.router.navigate(['/login']);
          }
          if(err.status === 503){
            this.showAlert(err.statusText,'Internal Server error:'+err.status);
          }else{
            this.showAlert(err.statusText,err.status);
          }

        return observableThrowError(err);
      })
    );
  }

  private showAlert(err: string, hdrtxt) {
    this.alertController
      .create({
        header: hdrtxt,
        message: err,
        buttons: ['ok'],
      })
      .then((alertElemnt) => {
        alertElemnt.present();
      });
  }
}
