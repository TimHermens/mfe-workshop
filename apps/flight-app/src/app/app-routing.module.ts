import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { loadRemoteModule } from '@nrwl/angular/mf';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      loadRemoteModule('home', './Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'flights',
    loadChildren: () =>
      loadRemoteModule('flight', './Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'passengers',
    loadChildren: () =>
      loadRemoteModule('passenger', './Module').then(
        (m) => m.RemoteEntryModule
      ),
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
