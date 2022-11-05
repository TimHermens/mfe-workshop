import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flight } from '../entities/flight';
import { FlightDataService } from '../infrastructure/flight.data.service';
import { LoggerService } from '@flight-workspace/shared-util';

@Injectable({ providedIn: 'root' })
export class TopFiveFlightsFacade {
  private readonly flightsSubject = new BehaviorSubject<Flight[]>([]);
  readonly flights$ = this.flightsSubject.asObservable();

  constructor(
    private readonly flightService: FlightDataService,
    private readonly logger: LoggerService
  ) {}

  findFlights(): void {
    this.flightService.find().subscribe({
      next: (flights) => {
        this.flightsSubject.next(flights.slice(0, 5));
      },
      error: (error) => {
        this.logger.error(`Error retrieving top 5 flights`, error);
      },
    });
  }
}
