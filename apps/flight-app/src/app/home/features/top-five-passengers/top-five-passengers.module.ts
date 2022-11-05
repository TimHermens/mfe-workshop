import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TopFivePassengersComponent } from './top-five-passengers.component';
import { PassengerTableModule } from '../../../passengers/ui/passenger-table/passenger-table.module';

@NgModule({
  imports: [CommonModule, PassengerTableModule],
  declarations: [TopFivePassengersComponent],
  exports: [TopFivePassengersComponent],
})
export class TopFivePassengersModule {}
