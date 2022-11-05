import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Flight } from '@flight-workspace/flight-domain';

@Component({
  selector: 'ui-flight-card',
  templateUrl: './flight-card.component.html',
})
export class FlightCardComponent {
  @Input() item: Flight | undefined;
  @Input() editable = false;
  @Output() editClicked = new EventEmitter<Flight>();

  onEditClicked() {
    if (this.item) {
      this.editClicked.next(this.item);
    }
  }
}
