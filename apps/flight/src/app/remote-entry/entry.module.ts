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
          import('@flight-workspace/flight-page-flight-home').then(
            (m) => m.FlightHomeModule
          ),
      },
    ]),
  ],
  providers: [],
})
export class RemoteEntryModule {}
