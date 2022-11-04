import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flight } from "../models/flight";
import { LoggerService } from "../../shared/util/logger/logger.service";
import { FlightService } from "./flight.service";


@Injectable({ providedIn: 'root' })
export class EditFlightFacade {
  private readonly flightSubject = new BehaviorSubject<Flight | undefined>(undefined);
  readonly flight$ = this.flightSubject.asObservable();

  constructor(private readonly flightService: FlightService,
              private readonly logger: LoggerService) {}

  findFlightById(id: string): void {
    this.flightService.findById(id)
      .subscribe({
        next: flight => {
          this.flightSubject.next(flight);
        },
        error: error => {
          this.logger.error(`Error retrieving flight ${id}`, error);
        }
      });
  }

}
