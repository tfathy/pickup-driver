import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JournyPage } from './journy.page';

const routes: Routes = [
  {
    path: '',
    component: JournyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JournyPageRoutingModule {}
