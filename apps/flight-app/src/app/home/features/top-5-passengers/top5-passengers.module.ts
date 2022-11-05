import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Top5PassengersComponent } from './top5-passengers.component';
import { PassengerTableModule } from '../../../passengers/ui/passenger-table/passenger-table.module';

@NgModule({
  imports: [CommonModule, PassengerTableModule],
  declarations: [Top5PassengersComponent],
  exports: [Top5PassengersComponent],
})
export class Top5PassengersModule {}
