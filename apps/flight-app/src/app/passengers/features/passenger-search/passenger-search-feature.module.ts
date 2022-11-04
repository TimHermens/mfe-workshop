import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { LetModule } from "@ngrx/component";
import { PassengerSearchComponent } from "./passenger-search.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LetModule,
  ],
  declarations: [
    PassengerSearchComponent
  ],
  exports: [
    PassengerSearchComponent
  ]
})
export class FlightSearchFeatureModule {
}
