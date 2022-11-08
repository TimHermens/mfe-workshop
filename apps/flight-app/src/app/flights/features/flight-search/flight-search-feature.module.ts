import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlightSearchComponent } from './flight-search.component';
import { FormsModule } from '@angular/forms';
import { FlightsUiModule } from '../../ui/flights-ui.module';
import { LetModule } from '@ngrx/component';

@NgModule({
  imports: [CommonModule, FormsModule, FlightsUiModule, LetModule],
  declarations: [FlightSearchComponent],
  exports: [FlightSearchComponent],
})
export class FlightSearchFeatureModule {}
