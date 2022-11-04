import { Component } from '@angular/core';
import { Passenger, SearchFacade } from '@flight-workspace/passenger/domain';

@Component({
  selector: 'feature-passenger-search',
  templateUrl: './passenger-search.component.html',
  styleUrls: ['./passenger-search.component.css'],
})
export class PassengerSearchComponent {
  firstname = '';
  name = 'Smith';
  passengerList$ = this.searchFacade.passengerList$;
  selectedPassenger: Passenger | undefined;

  constructor(private searchFacade: SearchFacade) {}

  load(): void {
    this.searchFacade.load(this.name, this.firstname);
  }

  toggleSelection(p: Passenger) {
    this.selectedPassenger = p;
  }
}
