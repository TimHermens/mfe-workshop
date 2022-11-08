import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Passenger } from '../../models/passenger';
import { EditPassengerFacade } from '../../services/edit-passenger.facade';

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
