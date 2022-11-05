import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlightCardModule } from './flight-card/flight-card.module';
import { FlightCardListModule } from './flight-card-list/flight-card-list.module';

@NgModule({
  imports: [CommonModule, FlightCardModule, FlightCardListModule],
  exports: [FlightCardModule, FlightCardListModule],
})
export class FlightsUiModule {}
