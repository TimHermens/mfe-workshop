import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PassengerEditPageRoutingModule } from "./passenger-edit-page-routing.module";
import { BreadcrumbModule } from "../../../shared/ui/breadcrumb/breadcrumb.module";
import { PassengerEditPageComponent } from "./passenger-edit-page.component";
import { PassengerEditFeatureModule } from "../../features/passenger-edit/passenger-edit-feature.module";

@NgModule({
  imports: [
    CommonModule,
    PassengerEditPageRoutingModule,
    BreadcrumbModule,
    PassengerEditFeatureModule
  ],
  declarations: [
    PassengerEditPageComponent
  ]
})
export class PassengerEditPageModule {
}
