import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../models/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  flights: Flight[] = [];
  baseUrl = '/api';

  constructor(private http: HttpClient) {}

  find(
    from = '',
    to = ''
  ): Observable<Flight[]> {
    const url = [this.baseUrl, 'flight'].join('/');
    let params = new HttpParams();
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }

    return this.http.get<Flight[]>(url, { params });
  }

  findById(id: string): Observable<Flight> {
    const url = [this.baseUrl, 'flight', id].join('/');
    return this.http.get<Flight>(url);
  }
}
