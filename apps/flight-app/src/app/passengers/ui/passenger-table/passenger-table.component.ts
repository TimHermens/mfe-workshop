import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Passenger } from '../../models/passenger';

@Component({
  selector: 'passenger-table',
  templateUrl: './passenger-table.component.html',
  styleUrls: ['./passenger-table.component.css'],
})
export class PassengerTableComponent {
  @Input() passengers: Passenger[] = [];
  @Input() editable = false;
  @Output() editClicked = new EventEmitter<Passenger>();

  onEditClicked(passenger: Passenger) {
    this.editClicked.next(passenger);
  }
}
