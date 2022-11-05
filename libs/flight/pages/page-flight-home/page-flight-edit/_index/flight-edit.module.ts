import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './flight-edit-routing.module';
import { FlightEditPageComponent } from './flight-edit.page.component';

@NgModule({
  imports: [CommonModule, PageRoutingModule],
  declarations: [FlightEditPageComponent],
})
export class FlightEditModule {}
