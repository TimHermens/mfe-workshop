import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home.page.component';
import { BreadcrumbModule } from '@flight-workspace/shared-ui';
import { TopFiveFlightsModule } from '@flight-workspace/home-features-top-five-flights';
import { TopFivePassengersModule } from '@flight-workspace/home-features-top-five-passengers';

@NgModule({
  imports: [
    CommonModule,
    BreadcrumbModule,
    PageRoutingModule,
    TopFiveFlightsModule,
    TopFivePassengersModule,
  ],
  declarations: [HomePageComponent],
})
export class HomeModule {}
