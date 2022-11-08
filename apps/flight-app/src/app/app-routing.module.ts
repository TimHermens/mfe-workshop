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
      import('./home/pages/home/home-page.module').then(
        (m) => m.HomePageModule
      ),
  },
  {
    path: 'flights',
    loadChildren: () =>
      import('./flights/pages/flight-home/flight-home-page.module').then(
        (m) => m.FlightHomePageModule
      ),
  },
  {
    path: 'passengers',
    loadChildren: () =>
      import(
        './passengers/pages/passenger-home/passenger-home-page.module'
      ).then((m) => m.PassengerHomePageModule),
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
