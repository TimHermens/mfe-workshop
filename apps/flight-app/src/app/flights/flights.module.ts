import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlightsRoutingModule } from "./flights-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FlightsRoutingModule
  ]
})
export class FlightsModule {
}
