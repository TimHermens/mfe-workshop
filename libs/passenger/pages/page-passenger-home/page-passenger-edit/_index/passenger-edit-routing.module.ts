import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassengerEditPageComponent } from './passenger-edit.page.component';

const routes: Routes = [{ path: '', component: PassengerEditPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
