import { AirportDataService } from '../infrastructure/airport.data.service';
import { useContext } from 'react';
import { AirportDomainContext } from './airport-domain-context';

export const useSearchAirportsFacade = () => {
  const { setAirports } = useContext(AirportDomainContext);

  const findAirports = async (name: string): Promise<void> => {
    try {
      const airports = await AirportDataService.find(name);
      setAirports(airports);
    } catch (error) {
      console.error(error);
    }
  };

  return { findAirports };
};
