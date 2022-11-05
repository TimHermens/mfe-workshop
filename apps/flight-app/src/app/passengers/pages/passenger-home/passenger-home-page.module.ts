import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PassengerHomePageRoutingModule } from './passenger-home-page-routing.module';
import { BreadcrumbModule } from '../../../shared/ui/breadcrumb/breadcrumb.module';
import { PassengerHomePageComponent } from './passenger-home-page.component';
import { PassengerSearchFeatureModule } from '../../features/passenger-search/passenger-search-feature.module';

@NgModule({
  imports: [
    CommonModule,
    PassengerHomePageRoutingModule,
    BreadcrumbModule,
    PassengerSearchFeatureModule,
  ],
  declarations: [PassengerHomePageComponent],
})
export class PassengerHomePageModule {}
