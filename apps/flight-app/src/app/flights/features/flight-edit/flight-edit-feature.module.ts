import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlightEditComponent } from './flight-edit.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FlightEditComponent],
  exports: [FlightEditComponent],
})
export class FlightEditFeatureModule {}
