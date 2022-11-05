import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Top5FlightsComponent } from './top5-flights.component';
import { FlightCardListModule } from '../../../flights/ui/flight-card-list/flight-card-list.module';

@NgModule({
  imports: [CommonModule, FlightCardListModule],
  declarations: [Top5FlightsComponent],
  exports: [Top5FlightsComponent],
})
export class Top5FlightsModule {}
