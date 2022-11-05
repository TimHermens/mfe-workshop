import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent implements OnInit {
  currentUrlSegments: { path: string; segment: string }[] = [];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/').slice(1);
    this.currentUrlSegments = urlSegments.map((segment, index) => {
      const path = `/${urlSegments.slice(0, index + 1).join('/')}`;
      return { path, segment };
    });
  }
}
