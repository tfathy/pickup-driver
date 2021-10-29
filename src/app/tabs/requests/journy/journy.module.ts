import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JournyPageRoutingModule } from './journy-routing.module';

import { JournyPage } from './journy.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    JournyPageRoutingModule
  ],
  declarations: [JournyPage]
})
export class JournyPageModule {}
