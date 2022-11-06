import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('@flight-workspace/passenger-page-passenger-home').then(
            (m) => m.PassengerHomeModule
          ),
      },
    ]),
  ],
  providers: [],
})
export class RemoteEntryModule {}
