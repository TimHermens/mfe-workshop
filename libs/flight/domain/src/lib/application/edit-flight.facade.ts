import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flight } from '../entities/flight';
import { LoggerService } from '@flight-workspace/shared-util';
import { FlightDataService } from '../infrastructure/flight.data.service';

@Injectable({ providedIn: 'root' })
export class EditFlightFacade {
  private readonly flightSubject = new BehaviorSubject<Flight | undefined>(
    undefined
  );
  readonly flight$ = this.flightSubject.asObservable();

  constructor(
    private readonly flightService: FlightDataService,
    private readonly logger: LoggerService
  ) {}

  findFlightById(id: string): void {
    this.flightService.findById(id).subscribe({
      next: (flight) => {
        this.flightSubject.next(flight);
      },
      error: (error) => {
        this.logger.error(`Error retrieving flight ${id}`, error);
      },
    });
  }
}
