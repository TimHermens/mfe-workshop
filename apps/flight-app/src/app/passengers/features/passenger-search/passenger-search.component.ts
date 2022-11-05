import { Component, EventEmitter, Output } from '@angular/core';
import { SearchPassengersFacade } from "../../services/search-passengers.facade";
import { Passenger } from "../../models/passenger";

@Component({
  selector: 'feature-passenger-search',
  templateUrl: './passenger-search.component.html',
  styleUrls: ['./passenger-search.component.css'],
})
export class PassengerSearchComponent {
  @Output() editClicked = new EventEmitter<Passenger>();

  firstname = '';
  name = '';
  passengerList$ = this.searchFacade.passengerList$;

  constructor(private readonly searchFacade: SearchPassengersFacade) {}

  load(): void {
    this.searchFacade.findPassengers(this.name, this.firstname);
  }

  onEditClicked(passenger: Passenger) {
    this.editClicked.next(passenger);
  }
}
