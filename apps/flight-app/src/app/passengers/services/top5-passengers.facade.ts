import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from '../../shared/util/logger/logger.service';
import { Passenger } from '../models/passenger';
import { PassengerDataService } from './passenger.data.service';

@Injectable({ providedIn: 'root' })
export class Top5PassengersFacade {
  private readonly passengersSubject = new BehaviorSubject<Passenger[]>([]);
  readonly passengers$ = this.passengersSubject.asObservable();

  constructor(
    private readonly passengerDataService: PassengerDataService,
    private readonly logger: LoggerService
  ) {}

  findPassengers(): void {
    this.passengerDataService.find().subscribe({
      next: (flights) => {
        this.passengersSubject.next(flights.slice(0, 5));
      },
      error: (error) => {
        this.logger.error(`Error retrieving top 5 passengers`, error);
      },
    });
  }
}
