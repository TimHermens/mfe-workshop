import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TopFiveFlightsComponent } from './top-five-flights.component';
import { FlightCardListModule } from '../../../flights/ui/flight-card-list/flight-card-list.module';

@NgModule({
  imports: [CommonModule, FlightCardListModule],
  declarations: [TopFiveFlightsComponent],
  exports: [TopFiveFlightsComponent],
})
export class TopFiveFlightsModule {}
