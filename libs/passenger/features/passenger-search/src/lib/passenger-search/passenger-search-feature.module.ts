import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetModule } from '@ngrx/component';
import { PassengerSearchComponent } from './passenger-search.component';
import { RouterModule } from '@angular/router';
import { PassengerTableModule } from '@flight-workspace/passenger-ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LetModule,
    RouterModule,
    PassengerTableModule,
  ],
  declarations: [PassengerSearchComponent],
  exports: [PassengerSearchComponent],
})
export class PassengerSearchFeatureModule {}
