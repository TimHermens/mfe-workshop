import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PassengerHomePageComponent } from "./passenger-home-page.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PassengerHomePageComponent
  },
  {
    path: ':id',
    loadChildren: () => import("../passenger-edit/passenger-edit-page.module")
      .then(m => m.PassengerEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassengerHomePageRoutingModule {}
