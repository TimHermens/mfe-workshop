import { Component, OnInit } from '@angular/core';
import { Flight, Top5FlightsFacade } from "@flight-workspace/flight-lib";
import { Observable } from "rxjs";

@Component({
  selector: 'top5-flights',
  templateUrl: './top5-flights.component.html',
  styleUrls: [ './top5-flights.component.css' ]
})
export class Top5FlightsComponent implements OnInit {
  flights$: Observable<Flight[]> = this.top5FlightsFacade.flights$;

  constructor(
    private readonly top5FlightsFacade: Top5FlightsFacade) {
  }

  ngOnInit(): void {
    this.top5FlightsFacade.findFlights();
  }
}
