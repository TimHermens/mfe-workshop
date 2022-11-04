import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flight } from '../models/flight';
import { FlightService } from "./flight.service";
import { LoggerService } from "../../shared/util/logger/logger.service";


@Injectable({ providedIn: 'root' })
export class SearchFlightsFacade {
  private readonly flightsSubject = new BehaviorSubject<Flight[]>([]);
  readonly flights$ = this.flightsSubject.asObservable();

  constructor(private readonly flightService: FlightService,
              private readonly logger: LoggerService) {}

  findFlights(from: string, to: string): void {
    this.flightService.find(from, to)
      .subscribe({
        next: flights => {
          this.flightsSubject.next(flights);
        },
        error: error => {
          this.logger.error(`Error retrieving flights from ${from} to ${to}`, error);
        }
      });
  }

}
