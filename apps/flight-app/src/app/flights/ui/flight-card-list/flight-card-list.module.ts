import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlightCardListComponent } from "./flight-card-list.component";
import { FlightCardModule } from "../flight-card/flight-card.module";

@NgModule({
  imports: [
    CommonModule,
    FlightCardModule
  ],
  declarations: [
    FlightCardListComponent
  ],
  exports: [
    FlightCardListComponent
  ]
})
export class FlightCardListModule {
}
