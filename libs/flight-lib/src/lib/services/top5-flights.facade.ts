import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flight, FlightService } from "@flight-workspace/flight-lib";
import { LoggerService } from "@flight-workspace/logger-lib";


@Injectable({ providedIn: 'root' })
export class Top5FlightsFacade {
  private readonly flightsSubject = new BehaviorSubject<Flight[]>([]);
  readonly flights$ = this.flightsSubject.asObservable();

  constructor(private readonly flightService: FlightService,
              private readonly logger: LoggerService) {}

  findFlights(): void {
    this.flightService.find()
      .subscribe({
        next: flights => {
          this.flightsSubject.next(flights.slice(0, 5));
        },
        error: error => {
          this.logger.error(`Error retrieving top 5 flights`, error);
        }
      });
  }

}
