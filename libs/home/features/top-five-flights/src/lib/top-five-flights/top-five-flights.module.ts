import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TopFiveFlightsComponent } from './top-five-flights.component';
import { FlightCardListModule } from '@flight-workspace/flight-api';

@NgModule({
  imports: [CommonModule, FlightCardListModule],
  declarations: [TopFiveFlightsComponent],
  exports: [TopFiveFlightsComponent],
})
export class TopFiveFlightsModule {}
