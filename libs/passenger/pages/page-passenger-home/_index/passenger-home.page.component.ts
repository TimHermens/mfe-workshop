import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Passenger } from '@flight-workspace/passenger-domain';

@Component({
  selector: 'page-passenger-home',
  templateUrl: './passenger-home.page.component.html',
  styleUrls: ['./passenger-home.page.component.css'],
})
export class PassengerHomePageComponent {
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  onEditClicked(passenger: Passenger) {
    this.router.navigate([passenger.id], { relativeTo: this.activatedRoute });
  }
}
