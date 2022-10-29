import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LetModule } from '@ngrx/component';
import { SearchComponent } from './search.component';
import { PassengerDomainModule } from '@flight-workspace/passenger/domain';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LetModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: SearchComponent
      }
    ]),
    PassengerDomainModule
  ],
  declarations: [SearchComponent],
  exports: [SearchComponent],
})
export class PassengerFeatureSearchModule {}
