import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { loadRemoteModule } from '@nrwl/angular/mf';
import { startsWith } from '@angular-architects/module-federation-tools';
import { RemoteWebComponent } from './remote-web-component/remote-web.component';
import { RemoteWebComponentOptions } from './remote-web-component/remote-web-component.options';
import { CachedRouteReuseStrategy } from './cached-route-reuse-strategy';

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
    matcher: startsWith('airports'),
    component: RemoteWebComponent,
    data: {
      remoteName: 'airport',
      remoteModule: './Module',
      elementName: 'airport-module',
    } as RemoteWebComponentOptions,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // providers: [{
  //   provide: RouteReuseStrategy,
  //   useClass: CachedRemoteRouteReuseStrategy
  // }]
})
export class PageRoutingModule {}
