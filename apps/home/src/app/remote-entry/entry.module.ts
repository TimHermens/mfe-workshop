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
          import('@flight-workspace/home-page-home').then((m) => m.HomeModule),
      },
    ]),
  ],
  providers: [],
})
export class RemoteEntryModule {}
