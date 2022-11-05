import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from '@flight-workspace/shared-util';
import { Passenger } from '../entities/passenger';
import { PassengerDataService } from '../infrastructure/passenger.data.service';

@Injectable({ providedIn: 'root' })
export class TopFivePassengersFacade {
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
