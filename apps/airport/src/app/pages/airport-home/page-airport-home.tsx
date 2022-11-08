import { FeatureAirportSearch } from '../../features/feature-airport-search';
import { Airport } from '../../domain/entities/airport';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../ui/breadcrumb';

export function PageAirportHome() {
  const navigate = useNavigate();

  function onEditClicked(airport: Airport) {
    navigate(`/airports/${airport.id}`);
  }

  return (
    <>
      <Breadcrumb />
      <FeatureAirportSearch onEditClicked={onEditClicked} />
    </>
  );
}
