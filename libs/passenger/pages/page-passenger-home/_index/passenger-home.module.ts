import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './passenger-home-routing.module';
import { PassengerHomePageComponent } from './passenger-home.page.component';
import { BreadcrumbModule } from '@flight-workspace/shared-ui';
import { PassengerSearchFeatureModule } from '@flight-workspace/passenger-features-passenger-search';

@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule,
    BreadcrumbModule,
    PassengerSearchFeatureModule,
  ],
  declarations: [PassengerHomePageComponent],
})
export class PassengerHomeModule {}
