import { Route, Routes } from 'react-router-dom';
import { PageAirportHome } from './page-airport-home';
import { PageAirportEdit } from './airport-edit/page-airport-edit';

export function PageAirportHomeRouting() {
  return (
    <Routes>
      <Route index element={<PageAirportHome />} />
      <Route path=":id" element={<PageAirportEdit />} />
    </Routes>
  );
}
