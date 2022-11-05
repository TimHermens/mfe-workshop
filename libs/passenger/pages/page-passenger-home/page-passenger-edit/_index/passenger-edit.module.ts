import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './passenger-edit-routing.module';
import { PassengerEditPageComponent } from './passenger-edit.page.component';
import { BreadcrumbModule } from '@flight-workspace/shared-ui';
import { PassengerEditFeatureModule } from '@flight-workspace/passenger-features-passenger-edit';

@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule,
    BreadcrumbModule,
    PassengerEditFeatureModule,
  ],
  declarations: [PassengerEditPageComponent],
})
export class PassengerEditModule {}
