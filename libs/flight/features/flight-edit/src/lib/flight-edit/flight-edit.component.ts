import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EditFlightFacade, Flight } from '@flight-workspace/flight-domain';

@Component({
  selector: 'feature-flight-edit',
  templateUrl: './flight-edit.component.html',
})
export class FlightEditComponent implements OnInit {
  readonly flight$: Observable<Flight | undefined> = this.flightFacade.flight$;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly flightFacade: EditFlightFacade
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.flightFacade.findFlightById(id);
  }
}
