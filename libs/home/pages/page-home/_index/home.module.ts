import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home.page.component';

@NgModule({
  imports: [CommonModule, PageRoutingModule],
  declarations: [HomePageComponent],
})
export class HomeModule {}
