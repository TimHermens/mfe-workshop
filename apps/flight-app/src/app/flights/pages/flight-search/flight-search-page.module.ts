import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlightSearchRoutingModule } from "./flight-search-routing.module";
import { FlightSearchPageComponent } from "./flight-search-page.component";
import { BreadcrumbModule } from "../../../shared/ui/breadcrumb/breadcrumb.module";
import { FlightSearchFeatureModule } from "../../features/flight-search/flight-search-feature.module";

@NgModule({
  imports: [
    CommonModule,
    FlightSearchFeatureModule,
    FlightSearchRoutingModule,
    BreadcrumbModule
  ],
  declarations: [
    FlightSearchPageComponent
  ]
})
export class FlightSearchPageModule {
}
