import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../../../flights/models/flight';
import { TopFiveFlightsFacade } from '../../../flights/services/top-five-flights-facade.service';

@Component({
  selector: 'feature-top-five-flights',
  templateUrl: './top-five-flights.component.html',
  styleUrls: ['./top-five-flights.component.css'],
})
export class TopFiveFlightsComponent implements OnInit {
  flights$: Observable<Flight[]> = this.topFiveFlightsFacade.flights$;

  constructor(private readonly topFiveFlightsFacade: TopFiveFlightsFacade) {}

  ngOnInit(): void {
    this.topFiveFlightsFacade.findFlights();
  }
}
