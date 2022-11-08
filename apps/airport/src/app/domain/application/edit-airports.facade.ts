import { Airport } from '../entities/airport';
import { AirportDataService } from '../infrastructure/airport.data.service';
import { useState } from 'react';

export const useEditAirportsFacade = () => {
  const [airport, setAirport] = useState<Airport>();

  const findAirport = async (id: number): Promise<void> => {
    try {
      const airport = await AirportDataService.findById(id);
      setAirport(airport);
    } catch (error) {
      console.error(error);
    }
  };

  return { airport, findAirport };
};
