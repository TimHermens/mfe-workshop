import React from 'react';
import { Airport } from '../entities/airport';

type AirportDomainContextType = {
  airports: Airport[];
  setAirports: React.Dispatch<React.SetStateAction<Airport[]>>;
};

export const AirportDomainContextInitialValue: AirportDomainContextType = {
  airports: [] as Airport[],
  setAirports: (value) => void 0,
};

export const AirportDomainContext = React.createContext(
  AirportDomainContextInitialValue
);
