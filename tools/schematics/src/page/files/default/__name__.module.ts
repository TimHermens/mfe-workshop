import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './<%= name %>-routing.module';
import { <%= className %>PageComponent } from './<%= name %>.page.component';

@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule
  ],
  declarations: [<%= className %>PageComponent]
})
export class <%= className %>Module {}
