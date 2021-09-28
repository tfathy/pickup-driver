import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from '../map/map.component';
import { OpenRequestDetailsComponent } from '../../../app/tabs/requests/open-requests/open-request-details/open-request-details.component';

@NgModule({
  declarations: [MapComponent,OpenRequestDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    MapComponent,
    OpenRequestDetailsComponent
  ],
})
export class SharedModule {}
