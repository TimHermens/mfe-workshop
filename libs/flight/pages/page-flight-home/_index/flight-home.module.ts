import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './flight-home-routing.module';
import { FlightHomePageComponent } from './flight-home.page.component';

@NgModule({
  imports: [CommonModule, PageRoutingModule],
  declarations: [FlightHomePageComponent],
})
export class FlightHomeModule {}
