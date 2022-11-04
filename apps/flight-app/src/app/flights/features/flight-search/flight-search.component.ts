import { Component } from '@angular/core';
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Flight } from "../../models/flight";
import { SearchFlightsFacade } from "../../services/search-flights.facade";

@Component({
  selector: 'feature-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: [ './flight-search.component.css' ]
})
export class FlightSearchComponent {

  flights$: Observable<Flight[]> = this.searchFlightsFacade.flights$;
  from = '';
  to = '';

  selected: { [id: number]: boolean } = {};

  constructor(
    private readonly searchFlightsFacade: SearchFlightsFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute) {
  }

  search(): void {
    this.searchFlightsFacade
      .findFlights(this.from, this.to);
  }

  onEditClicked(flight: Flight) {
    this.router.navigate([flight.id], {relativeTo: this.activatedRoute});
  }
}
