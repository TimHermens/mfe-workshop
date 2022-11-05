import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PassengerTableComponent } from "./passenger-table.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PassengerTableComponent
  ],
  exports: [
    PassengerTableComponent
  ]
})
export class PassengerTableModule {
}
