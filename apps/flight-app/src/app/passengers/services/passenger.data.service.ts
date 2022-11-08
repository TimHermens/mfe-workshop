import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Passenger } from '../models/passenger';

@Injectable({ providedIn: 'root' })
export class PassengerDataService {
  private readonly baseUrl = '/api/passenger';

  constructor(private readonly http: HttpClient) {}

  find(name = '', firstname = ''): Observable<Passenger[]> {
    let params = new HttpParams();
    if (name) {
      params = params.set('name', name);
    }
    if (firstname) {
      params = params.set('firstName', firstname);
    }

    return this.http.get<Passenger[]>(this.baseUrl, { params });
  }

  findById(id: string): Observable<Passenger> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Passenger>(url);
  }
}
