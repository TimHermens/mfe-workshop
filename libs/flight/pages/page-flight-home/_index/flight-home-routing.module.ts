import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightHomePageComponent } from './flight-home.page.component';

const routes: Routes = [
  { path: '', component: FlightHomePageComponent },
  {
    path: 'flight-edit',
    loadChildren: () =>
      import('@flight-workspace/flight-page-flight-edit').then(
        (m) => m.FlightEditModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
