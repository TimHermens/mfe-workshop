import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Passenger } from '../../../passengers/models/passenger';
import { Top5PassengersFacade } from '../../../passengers/services/top5-passengers.facade';

@Component({
  selector: 'top5-passengers',
  templateUrl: './top5-passengers.component.html',
  styleUrls: ['./top5-passengers.component.css'],
})
export class Top5PassengersComponent implements OnInit {
  passengers$: Observable<Passenger[]> = this.top5PassengersFacade.passengers$;

  constructor(private readonly top5PassengersFacade: Top5PassengersFacade) {}

  ngOnInit(): void {
    this.top5PassengersFacade.findPassengers();
  }
}
