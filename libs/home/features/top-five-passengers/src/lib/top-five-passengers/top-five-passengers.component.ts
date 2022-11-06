import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Passenger,
  TopFivePassengersFacade,
} from '@flight-workspace/passenger-api';

@Component({
  selector: 'feature-top-five-passengers',
  templateUrl: './top-five-passengers.component.html',
  styleUrls: ['./top-five-passengers.component.css'],
})
export class TopFivePassengersComponent implements OnInit {
  passengers$: Observable<Passenger[]> =
    this.topFivePassengersFacade.passengers$;

  constructor(
    private readonly topFivePassengersFacade: TopFivePassengersFacade
  ) {}

  ngOnInit(): void {
    this.topFivePassengersFacade.findPassengers();
  }
}
