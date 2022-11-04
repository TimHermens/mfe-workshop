import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightSearchPageComponent } from "./flight-search-page.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FlightSearchPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightSearchRoutingModule {}
