import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/guards/auth.guard';

import { RequestsPage } from './requests.page';

const routes: Routes = [
  {
    path: '',
    component: RequestsPage,canLoad:[AuthGuard]
  },
  {
    path: 'open-requests',
    loadChildren: () => import('./open-requests/open-requests.module').then( m => m.OpenRequestsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestsPageRoutingModule {}
