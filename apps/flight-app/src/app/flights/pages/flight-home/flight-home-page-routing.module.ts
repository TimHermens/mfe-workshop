import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightHomePageComponent } from './flight-home-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FlightHomePageComponent,
  },
  {
    path: ':id',
    loadChildren: () =>
      import('../flight-edit/flight-edit-page.module').then(
        (m) => m.FlightEditPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightHomePageRoutingModule {}
