import { Navigate, Route, Routes } from 'react-router-dom';
import { PageAirportHomeRouting } from './pages/airport-home/page-airport-home-routing';

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate replace to="/airports" />} />
      <Route path="airports/*" element={<PageAirportHomeRouting />} />
    </Routes>
  );
}
