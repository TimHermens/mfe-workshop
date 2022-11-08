import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { <%= className %>PageComponent } from './<%= name %>.page.component';

const routes: Routes = [
  { path: '', component: <%= className %>PageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
