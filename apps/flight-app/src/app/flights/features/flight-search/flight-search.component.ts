import { Component, EventEmitter, Output } from '@angular/core';
import { Flight } from '../../models/flight';
import { SearchFlightsFacade } from '../../services/search-flights.facade';

@Component({
  selector: 'feature-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent {
  @Output() editClicked = new EventEmitter<Flight>();

  flights$ = this.searchFlightsFacade.flights$;
  from = '';
  to = '';

  selected: { [id: number]: boolean } = {};

  constructor(private readonly searchFlightsFacade: SearchFlightsFacade) {}

  search(): void {
    this.searchFlightsFacade.findFlights(this.from, this.to);
  }

  onEditClicked(flight: Flight) {
    this.editClicked.next(flight);
  }
}
