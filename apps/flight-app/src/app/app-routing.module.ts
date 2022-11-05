import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('@flight-workspace/home-page-home').then((m) => m.HomeModule),
  },
  {
    path: 'flights',
    loadChildren: () =>
      import('@flight-workspace/flight-page-flight-home').then(
        (m) => m.FlightHomeModule
      ),
  },
  {
    path: 'passengers',
    loadChildren: () =>
      import('@flight-workspace/passenger-page-passenger-home').then(
        (m) => m.PassengerHomeModule
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
