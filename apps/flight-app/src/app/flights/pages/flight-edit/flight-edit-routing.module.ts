import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightEditPageComponent } from './flight-edit-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FlightEditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightEditRoutingModule {}
