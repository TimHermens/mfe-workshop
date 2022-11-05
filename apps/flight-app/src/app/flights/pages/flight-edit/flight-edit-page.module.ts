import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlightEditRoutingModule } from './flight-edit-routing.module';
import { FlightEditPageComponent } from './flight-edit-page.component';
import { BreadcrumbModule } from '../../../shared/ui/breadcrumb/breadcrumb.module';
import { FlightEditFeatureModule } from '../../features/flight-edit/flight-edit-feature.module';

@NgModule({
  imports: [
    CommonModule,
    FlightEditRoutingModule,
    BreadcrumbModule,
    FlightEditFeatureModule,
  ],
  declarations: [FlightEditPageComponent],
})
export class FlightEditPageModule {}
