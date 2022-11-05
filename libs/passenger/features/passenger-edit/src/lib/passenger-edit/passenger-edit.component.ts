import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  EditPassengerFacade,
  Passenger,
} from '@flight-workspace/passenger-domain';

@Component({
  selector: 'feature-passenger-edit',
  templateUrl: './passenger-edit.component.html',
})
export class PassengerEditComponent implements OnInit {
  readonly passenger$: Observable<Passenger | undefined> =
    this.editPassengerFacade.passenger$;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly editPassengerFacade: EditPassengerFacade
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.editPassengerFacade.findPassengerById(id);
  }
}
