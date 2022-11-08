import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log(message: string): void {
    console.log(message);
  }

  error(message: string, error: unknown): void {
    console.error(message, error);
  }
}
