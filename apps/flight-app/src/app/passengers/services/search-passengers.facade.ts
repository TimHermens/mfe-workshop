import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Passenger } from '../models/passenger';
import { PassengerDataService } from './passenger.data.service';
import { LoggerService } from "../../shared/util/logger/logger.service";


@Injectable({providedIn: 'root'})
export class SearchPassengersFacade {

  private passengerListSubject = new BehaviorSubject<Passenger[]>([]);
  passengerList$ = this.passengerListSubject.asObservable();

  constructor(private readonly passengerDataService: PassengerDataService,
              private readonly logger: LoggerService) {
  }

  findPassengers(name: string, firstname: string): void {
    this.passengerDataService.find(name, firstname).subscribe({
      next: passengerList => {
        this.passengerListSubject.next(passengerList)
      },
      error: err => {
        this.logger.error('Error retrieving passengers', err);
      }
    });
  }
}
