import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassengerHomePageComponent } from './passenger-home.page.component';

const routes: Routes = [{ path: '', component: PassengerHomePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
