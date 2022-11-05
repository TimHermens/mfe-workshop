import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Passenger } from '../../../passengers/models/passenger';
import { TopFivePassengersFacade } from '../../../passengers/services/top-five-passengers-facade.service';

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
