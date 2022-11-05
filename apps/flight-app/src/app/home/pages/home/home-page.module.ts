import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import { TopFiveFlightsModule } from '../../features/top-five-flights/top-five-flights.module';
import { TopFivePassengersModule } from '../../features/top-five-passengers/top-five-passengers.module';
import { BreadcrumbModule } from '../../../shared/ui/breadcrumb/breadcrumb.module';

@NgModule({
  imports: [
    CommonModule,
    BreadcrumbModule,
    HomePageRoutingModule,
    TopFiveFlightsModule,
    TopFivePassengersModule,
  ],
  declarations: [HomePageComponent],
})
export class HomePageModule {}
