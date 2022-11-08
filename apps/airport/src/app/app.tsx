// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { StrictMode, useState } from 'react';
import { AppRoutes } from './app-routes';
import { AirportDomainContext } from './domain/application/airport-domain-context';
import { Airport } from './domain/entities/airport';

export function App() {
  const [airports, setAirports] = useState<Airport[]>([]);
  return (
    <AirportDomainContext.Provider value={{ airports, setAirports }}>
      <AppRoutes />
    </AirportDomainContext.Provider>
  );
}

export class MfeElement extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.getElementById('airport-module');
    if (!mountPoint) {
      throw new Error('airport-module mount element not found!');
    }
    const root = ReactDOM.createRoot(mountPoint);
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
  }
}

export default App;
