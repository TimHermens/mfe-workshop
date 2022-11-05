import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from '../../shared/util/logger/logger.service';
import { Passenger } from '../models/passenger';
import { PassengerDataService } from './passenger.data.service';

@Injectable({ providedIn: 'root' })
export class EditPassengerFacade {
  private readonly passengerSubject = new BehaviorSubject<
    Passenger | undefined
  >(undefined);
  readonly passenger$ = this.passengerSubject.asObservable();

  constructor(
    private readonly passengerDataService: PassengerDataService,
    private readonly logger: LoggerService
  ) {}

  findPassengerById(id: string): void {
    this.passengerDataService.findById(id).subscribe({
      next: (passenger) => {
        this.passengerSubject.next(passenger);
      },
      error: (error) => {
        this.logger.error(`Error retrieving flight ${id}`, error);
      },
    });
  }
}
