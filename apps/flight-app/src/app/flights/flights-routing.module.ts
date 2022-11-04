import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import("./pages/flight-search/flight-search-page.module")
      .then(m => m.FlightSearchPageModule)
  },
  {
    path: ':id',
    loadChildren: () => import("./pages/flight-edit/flight-edit-page.module")
      .then(m => m.FlightEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightsRoutingModule {}
