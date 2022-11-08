import { Airport } from '../entities/airport';

export class AirportDataService {
  private static readonly baseUrl = '/api/airport';

  static async find(name = ''): Promise<Airport[]> {
    const params = new URLSearchParams();
    if (name) {
      params.set('name', name); //test
    }
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const res = await fetch(`${this.baseUrl}?${params.toString()}`, {
      headers,
    });
    const jsonResponse = await res.json();
    return jsonResponse as Airport[];
  }

  static async findById(id: number): Promise<Airport> {
    const url = `${this.baseUrl}/${id}`;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const res = await fetch(url, { headers });
    const jsonResponse = await res.json();
    return jsonResponse as Airport;
  }
}
