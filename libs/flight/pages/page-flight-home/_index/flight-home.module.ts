import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './flight-home-routing.module';
import { FlightHomePageComponent } from './flight-home.page.component';
import { FlightSearchFeatureModule } from '@flight-workspace/flight-features-flight-search';
import { BreadcrumbModule } from '@flight-workspace/shared-ui';

@NgModule({
  imports: [
    CommonModule,
    FlightSearchFeatureModule,
    PageRoutingModule,
    BreadcrumbModule,
  ],
  declarations: [FlightHomePageComponent],
})
export class FlightHomeModule {}
