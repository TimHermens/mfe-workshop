import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { Top5FlightsModule } from "../../features/top-5-flights/top5-flights.module";

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    Top5FlightsModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule {
}
