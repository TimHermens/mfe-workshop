import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from "rxjs";
import { Flight } from "../../models/flight";

@Component({
  selector: 'flight-card-list',
  templateUrl: './flight-card-list.component.html',
  styleUrls: [ './flight-card-list.component.css' ]
})
export class FlightCardListComponent {
  @Input() flights$: Observable<Flight[]> | undefined;
  @Input() editable = false;
  @Output() editClicked = new EventEmitter<Flight>();

  onEditClicked(flight: Flight) {
    this.editClicked.next(flight);
  }
}
