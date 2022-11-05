import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Flight } from '@flight-workspace/flight-domain';

@Component({
  selector: 'ui-flight-card-list',
  templateUrl: './flight-card-list.component.html',
  styleUrls: ['./flight-card-list.component.css'],
})
export class FlightCardListComponent {
  @Input() flights: Flight[] = [];
  @Input() editable = false;
  @Output() editClicked = new EventEmitter<Flight>();

  onEditClicked(flight: Flight) {
    this.editClicked.next(flight);
  }
}
