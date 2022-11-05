import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';

@NgModule({
  imports: [CommonModule, BreadcrumbModule],
  exports: [BreadcrumbModule],
})
export class SharedUiModule {}
