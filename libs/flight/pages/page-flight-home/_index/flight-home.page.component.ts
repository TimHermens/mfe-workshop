import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Flight } from '@flight-workspace/flight-domain';

@Component({
  selector: 'page-flight-home',
  templateUrl: './flight-home.page.component.html',
  styleUrls: ['./flight-home.page.component.css'],
})
export class FlightHomePageComponent {
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  onEditClicked(flight: Flight) {
    this.router.navigate([flight.id], { relativeTo: this.activatedRoute });
  }
}
