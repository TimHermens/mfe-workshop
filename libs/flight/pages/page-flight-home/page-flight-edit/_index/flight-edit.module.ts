import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './flight-edit-routing.module';
import { FlightEditPageComponent } from './flight-edit.page.component';
import { BreadcrumbModule } from '@flight-workspace/shared-ui';
import { FlightEditFeatureModule } from '@flight-workspace/flight-features-flight-edit';

@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule,
    BreadcrumbModule,
    FlightEditFeatureModule,
  ],
  declarations: [FlightEditPageComponent],
})
export class FlightEditModule {}
