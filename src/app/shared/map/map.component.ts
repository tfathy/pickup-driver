/* eslint-disable object-shorthand */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { DriverAuthToken, readStorage } from '../common-utils';
import { SlOrderModel } from '../models/sl-order-model';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  @Input() center = { lat: 21.43531801495943, lng: 39.825938147213115 }; // meca 21.43531801495943, 39.825938147213115
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  @Input() showToolbar = true;
  @Input() newRequests: SlOrderModel[] = [];
  clickListener: any;
  googleMaps: any;
  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2
  ) {}
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  async ngAfterViewInit(): Promise<void> {
    this.getGoogleMaps()
      .then((googleMaps) => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement; // the dev
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16,
        });

        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible'); // render the map after is beign ready
        });

        if (this.selectable) {
          this.clickListener = map.addListener('click', (event) => {
            console.log('you clicked on the map-lisner fired');
            const selectedCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            console.log(selectedCoords);
            this.modalCtrl.dismiss(selectedCoords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.center,
            map: map,
            title: 'Picked Location',
          });
          marker.setMap(map);
        }
        console.log('in map comp:this.newRequests=',this.newRequests)
        if (this.newRequests) {
          // draw the hot area
          const image = '/assets/icon/spot.png';
          this.newRequests.forEach((element) => {
              if(element.sourceLat !==null && element.sourceLong !==null){
                const customerLocation:  { lat: number; lng: number }={
                  lat: parseFloat(element.sourceLat),
                  lng: parseFloat(element.sourceLong)
                } ;
                const marker = new googleMaps.Marker({
                  position: customerLocation,
                  map: map,
                  title: element.customer.phoneNumber,
                });
                marker.setMap(map);
              }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnInit() {}
  onCancel() {
    this.modalCtrl.dismiss();
  }
  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }
}
