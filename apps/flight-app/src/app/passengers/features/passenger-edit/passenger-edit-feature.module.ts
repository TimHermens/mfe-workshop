import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PassengerEditComponent } from "./passenger-edit.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PassengerEditComponent
  ],
  exports: [
    PassengerEditComponent
  ]
})
export class PassengerEditFeatureModule {
}
