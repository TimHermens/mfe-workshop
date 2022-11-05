import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../entities/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightDataService {
  private readonly baseUrl = '/api/flight';

  constructor(private http: HttpClient) {}

  find(from = '', to = ''): Observable<Flight[]> {
    let params = new HttpParams();
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }

    return this.http.get<Flight[]>(this.baseUrl, { params });
  }

  findById(id: string): Observable<Flight> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Flight>(url);
  }
}
