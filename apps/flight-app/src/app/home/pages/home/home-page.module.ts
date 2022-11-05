import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomePageRoutingModule } from "./home-page-routing.module";
import { HomePageComponent } from "./home-page.component";
import { Top5FlightsModule } from "../../features/top-5-flights/top5-flights.module";
import { Top5PassengersModule } from "../../features/top-5-passengers/top5-passengers.module";
import { BreadcrumbModule } from "../../../shared/ui/breadcrumb/breadcrumb.module";

@NgModule({
  imports: [
    CommonModule,
    BreadcrumbModule,
    HomePageRoutingModule,
    Top5FlightsModule,
    Top5PassengersModule
  ],
  declarations: [
    HomePageComponent
  ]
})
export class HomePageModule {
}
