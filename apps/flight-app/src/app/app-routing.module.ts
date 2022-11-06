import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('home/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'flights',
    loadChildren: () =>
      import('flight/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'passengers',
    loadChildren: () =>
      import('passenger/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
