import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlightHomePageRoutingModule } from './flight-home-page-routing.module';
import { FlightHomePageComponent } from './flight-home-page.component';
import { BreadcrumbModule } from '../../../shared/ui/breadcrumb/breadcrumb.module';
import { FlightSearchFeatureModule } from '../../features/flight-search/flight-search-feature.module';

@NgModule({
  imports: [
    CommonModule,
    FlightSearchFeatureModule,
    FlightHomePageRoutingModule,
    BreadcrumbModule,
  ],
  declarations: [FlightHomePageComponent],
})
export class FlightHomePageModule {}
